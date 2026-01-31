import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

app.use(cors());
app.use(express.json());

interface AuthRequest extends Request {
    user?: { id: string, role: string };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user as { id: string, role: string };
        next();
    });
};

const checkRole = (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }
    next();
};

const isAdmin = checkRole(['admin']);
const isStaffOrAdmin = checkRole(['staff', 'admin']);

// Initialize Database
async function initDb() {
    // Render persistent disk path
    const dbPath = process.env.RENDER 
        ? '/opt/render/project/src/backend/database.sqlite' 
        : './database.sqlite';
        
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Run existing schema if database is new
    const schemaPath = path.resolve(process.cwd(), '../migrations/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await db.exec(schema);

    // Optional: Run seed data if products table is empty
    const productsCount = await db.get('SELECT COUNT(*) as count FROM products');
    if (productsCount.count === 0) {
        const seedPath = path.resolve(process.cwd(), '../migrations/seed.sql');
        const seed = fs.readFileSync(seedPath, 'utf8');
        await db.exec(seed);
    }

    return db;
}

// API Routes
initDb().then((db) => {
    // Health check endpoint
    app.get('/api/health', async (req, res) => {
        try {
            await db.get('SELECT 1');
            res.json({ status: 'ok', db: 'sqlite' });
        } catch (error) {
            res.status(500).json({ status: 'error', db: 'disconnected' });
        }
    });

    // Visitor Tracking Middleware
    app.use(async (req, res, next) => {
        const visitorId = (req.headers['x-visitor-id'] as string) || 'guest';
        // Track only GET requests to pages (not APIs or static files)
        if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
            try {
                await db.run('INSERT INTO site_visits (visitor_id, path) VALUES (?, ?)', [visitorId, req.path]);
            } catch (err) {
                console.error('Visitor tracking error:', err);
            }
        }
        next();
    });

    // Track visits (for SPA internal navigation)
    app.post('/api/track', async (req, res) => {
        const { path, visitorId } = req.body;
        try {
            await db.run('INSERT INTO site_visits (visitor_id, path) VALUES (?, ?)', [visitorId || 'guest', path || '/']);
            res.status(204).send();
        } catch (err) {
            console.error('Track error:', err);
            res.status(500).json({ error: 'Failed to track visit' });
        }
    });

    // Get all products
    app.get('/api/products', async (req, res) => {
        const products = await db.all('SELECT * FROM products');
        res.json(products);
    });

    // Get categories
    app.get('/api/categories', async (req, res) => {
        const categories = await db.all('SELECT * FROM categories');
        res.json(categories);
    });

    // Product Reviews
    app.get('/api/products/:id/reviews', async (req, res) => {
        const { id } = req.params;
        const reviews = await db.all('SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC', [id]);
        res.json(reviews);
    });

    app.post('/api/reviews', authenticateToken, async (req: AuthRequest, res) => {
        const { productId, rating, comment } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        try {
            const user = await db.get('SELECT full_name FROM users WHERE id = ?', [userId]);
            const reviewId = uuidv4();
            await db.run(
                'INSERT INTO reviews (id, productId, userId, userName, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
                [reviewId, productId, userId, user.full_name || 'Anonymous', rating, comment]
            );
            res.status(201).json({ success: true });
        } catch (error) {
            console.error('Error submitting review:', error);
            res.status(500).json({ error: 'Failed to submit review' });
        }
    });

    // Wishlist
    app.get('/api/wishlist', authenticateToken, async (req: AuthRequest, res) => {
        const userId = req.user?.id;
        try {
            const wishlistItems = await db.all(`
                SELECT p.* FROM products p
                JOIN wishlist w ON p.id = w.productId
                WHERE w.userId = ?
            `, [userId]);
            res.json(wishlistItems);
        } catch {
            res.status(500).json({ error: 'Failed to fetch wishlist' });
        }
    });

    app.post('/api/wishlist', authenticateToken, async (req: AuthRequest, res) => {
        const { productId } = req.body;
        const userId = req.user?.id;
        try {
            await db.run('INSERT OR IGNORE INTO wishlist (userId, productId) VALUES (?, ?)', [userId, productId]);
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: 'Failed to add to wishlist' });
        }
    });

    app.delete('/api/wishlist/:productId', authenticateToken, async (req: AuthRequest, res) => {
        const { productId } = req.params;
        const userId = req.user?.id;
        try {
            await db.run('DELETE FROM wishlist WHERE userId = ? AND productId = ?', [userId, productId]);
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: 'Failed to remove from wishlist' });
        }
    });

    /** ADMIN ONLY: Category Management **/
    app.post('/api/admin/categories', authenticateToken, isAdmin, async (req, res) => {
        const { name, icon } = req.body;
        try {
            await db.run('INSERT INTO categories (name, icon) VALUES (?, ?)', [name, icon]);
            res.status(201).json({ success: true });
        } catch {
            res.status(400).json({ error: "Category already exists" });
        }
    });

    app.patch('/api/admin/categories/:id', authenticateToken, isAdmin, async (req, res) => {
        const { id } = req.params;
        const { name, icon } = req.body;
        try {
            await db.run(
                'UPDATE categories SET name = COALESCE(?, name), icon = COALESCE(?, icon) WHERE id = ?',
                [name, icon, id]
            );
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.delete('/api/admin/categories/:id', authenticateToken, isAdmin, async (req, res) => {
        const { id } = req.params;
        try {
            await db.run('DELETE FROM categories WHERE id = ?', [id]);
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // Search Route
    app.get('/api/search', async (req, res) => {
        const { q } = req.query;
        if (!q || typeof q !== 'string') return res.json([]);
        
        try {
            const results = await db.all(
                'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? LIMIT 10',
                [`%${q}%`, `%${q}%`]
            );
            res.json(results);
        } catch {
            res.status(500).json({ error: 'Search failed' });
        }
    });

    // Registration Route
    app.post('/api/register', async (req, res) => {
        const { username, email, password, full_name } = req.body;
        
        try {
            console.log(`Registering user: ${email}`);
            const hashedPassword = await bcrypt.hash(password, 12);
            const userId = uuidv4();

            await db.run(
                'INSERT INTO users (id, username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, username || email.split('@')[0], email, hashedPassword, full_name, 'user']
            );

            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({ error: "Username or email already exists" });
        }
    });

    // Login Route
    app.post('/api/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

            if (user && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                const userProfile = { ...user };
                delete (userProfile as { password?: string }).password;
                res.json({ token, user: userProfile });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // Profile Route
    app.get('/api/profile', authenticateToken, async (req: AuthRequest, res) => {
        try {
            const user = await db.get('SELECT id, username, email, full_name, address, role, profile_image, created_at FROM users WHERE id = ?', [req.user?.id]);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.patch('/api/profile', authenticateToken, async (req: AuthRequest, res) => {
        const { full_name, address, profile_image } = req.body;
        try {
            await db.run(
                `UPDATE users SET 
                    full_name = COALESCE(?, full_name),
                    address = COALESCE(?, address),
                    profile_image = COALESCE(?, profile_image)
                WHERE id = ?`,
                [full_name, address, profile_image, req.user?.id]
            );
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Updated Checkout endpoint
    app.post('/api/checkout', async (req, res) => {
        const { items, total, guestDetails, userId, createAccount } = req.body;
        let finalUserId = userId || null;

        try {
            console.log('Incoming checkout request:', JSON.stringify(req.body, null, 2));
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: "No items in order" });
            }

            // Handle Account Creation if requested during guest checkout
            if (!userId && createAccount && guestDetails) {
                const hashedPassword = await bcrypt.hash(guestDetails.password, 12);
                finalUserId = uuidv4();
                await db.run(
                    'INSERT INTO users (id, username, email, password, full_name, address) VALUES (?, ?, ?, ?, ?, ?)',
                    [finalUserId, guestDetails.email.split('@')[0], guestDetails.email, hashedPassword, guestDetails.full_name, guestDetails.address]
                );
            }

            const orderId = `ORD-${Date.now()}`;
            const customerName = guestDetails?.full_name || req.body.customerName || 'Valued Customer';
            const customerEmail = guestDetails?.email || req.body.customerEmail || 'no-email@frahspaces.com';
            const deliveryAddress = guestDetails?.address || req.body.deliveryAddress || 'Pick up at store';

            await db.run(
                'INSERT INTO orders (id, userId, customerName, customerEmail, deliveryAddress, total, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [orderId, finalUserId, customerName, customerEmail, deliveryAddress, total || 0, 'pending']
            );

            for (const item of items) {
                await db.run(
                    'INSERT INTO order_items (orderId, productId, productName, quantity, price) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.productId, item.productName, item.quantity, item.price]
                );
            }

            // Generate WhatsApp Message Link
            const adminWhatsApp = process.env.ADMIN_WHATSAPP || "254768396296"; 
            const message = encodeURIComponent(
                `🚀 *New frah spaces Order!* \n\n` +
                `*Order ID:* ${orderId}\n` +
                `*Customer:* ${customerName}\n` +
                `*Total:* KES ${total}\n` +
                `*Address:* ${deliveryAddress}\n\n` +
                `Please login to the dashboard to assign staff.`
            );
            const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${message}`;

            res.status(201).json({ success: true, orderId, whatsappUrl });
        } catch (error) {
            console.error('Checkout error:', error);
            res.status(500).json({ error: 'Failed to process checkout' });
        }
    });

    // Admin Route: Get Dashboard Stats
    app.get('/api/admin/stats', authenticateToken, isStaffOrAdmin, async (req, res) => {
        try {
            const totalRevenue = await db.get("SELECT SUM(total) as total FROM orders WHERE status != 'cancelled'");
            const totalOrders = await db.get("SELECT COUNT(*) as count FROM orders");
            const pendingOrders = await db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
            const completedOrders = await db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'");
            
            const dailySales = await db.all(`
                SELECT DATE(createdAt) as date, SUM(total) as revenue 
                FROM orders 
                WHERE status != 'cancelled' 
                GROUP BY DATE(createdAt) 
                ORDER BY date DESC 
                LIMIT 7
            `);

            const productSales = await db.all(`
                SELECT productName as name, SUM(quantity) as sales 
                FROM order_items 
                GROUP BY productName 
                ORDER BY sales DESC 
                LIMIT 5
            `);

            res.json({
                totalRevenue: totalRevenue.total || 0,
                totalOrders: totalOrders.count || 0,
                pendingOrders: pendingOrders.count || 0,
                completedOrders: completedOrders.count || 0,
                dailySales: dailySales.reverse(),
                productSales
            });
        } catch (error) {
            console.error('Stats error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Analytics (Financials & Visitors)
    app.get('/api/admin/analytics', authenticateToken, isStaffOrAdmin, async (req, res) => {
        try {
            const finance = await db.get("SELECT SUM(total) as revenue, COUNT(*) as orders FROM orders WHERE status='delivered'");
            const visitors = await db.get("SELECT COUNT(DISTINCT visitor_id) as unique_users FROM site_visits");
            const categorySales = await db.all(`
                SELECT p.category_name as name, SUM(oi.price * oi.quantity) as value 
                FROM order_items oi 
                JOIN products p ON oi.productId = p.id 
                GROUP BY p.category_name
            `);
            res.json({ 
                finance: {
                    revenue: finance.revenue || 0,
                    orders: finance.orders || 0
                }, 
                visitors: visitors.unique_users || 0, 
                categorySales 
            });
        } catch (error) {
            console.error('Analytics error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /** ADMIN ONLY: User & Staff Management **/
    app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
        try {
            const users = await db.all("SELECT id, username, email, role, full_name, address, profile_image, created_at FROM users ORDER BY created_at DESC");
            res.json(users);
        } catch {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    });

    app.post('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
        const { username, email, password, role, full_name, address } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const userId = uuidv4();
            const finalUsername = username || email.split('@')[0];
            await db.run(
                'INSERT INTO users (id, username, email, password, role, full_name, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, finalUsername, email, hashedPassword, role, full_name, address]
            );
            res.status(201).json({ success: true, userId });
        } catch (error) {
            console.error('Admin add user error:', error);
            res.status(400).json({ error: "User already exists or invalid data" });
        }
    });

    app.patch('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
        const { id } = req.params;
        const { role, full_name, address } = req.body;
        try {
            await db.run(
                `UPDATE users SET 
                    role = COALESCE(?, role),
                    full_name = COALESCE(?, full_name),
                    address = COALESCE(?, address)
                WHERE id = ?`,
                [role, full_name, address, id]
            );
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
        const { id } = req.params;
        try {
            await db.run('DELETE FROM users WHERE id = ?', [id]);
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.get('/api/admin/staff', authenticateToken, isAdmin, async (req, res) => {
        try {
            const staff = await db.all("SELECT id, full_name, role FROM users WHERE role IN ('staff', 'admin')");
            res.json(staff);
        } catch {
            res.status(500).json({ error: "Failed to fetch staff" });
        }
    });

    /** ADMIN & STAFF: Order Management **/
    app.get('/api/admin/orders', authenticateToken, isStaffOrAdmin, async (req, res) => {
        try {
            const orders = await db.all(`
                SELECT o.*, u.full_name as clientName, u.email as clientEmail 
                FROM orders o 
                LEFT JOIN users u ON o.userId = u.id
                ORDER BY o.createdAt DESC
            `);
            res.json(orders);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/orders/:id/items', authenticateToken, isStaffOrAdmin, async (req, res) => {
        const { id } = req.params;
        try {
            const items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [id]);
            res.json(items);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // 1. Admin Endpoint to assign staff
    app.patch('/api/admin/orders/:id/assign', authenticateToken, isStaffOrAdmin, async (req, res) => {
        const { staffId } = req.body;
        try {
            await db.run('UPDATE orders SET assignedStaffId = ? WHERE id = ?', [staffId, req.params.id]);
            res.json({ success: true });
        } catch (e) {
            console.error('Assignment error:', e);
            res.status(500).json({ error: "Assignment failed" });
        }
    });

    /** ADMIN & STAFF: Update order status/tracking/staff assignment **/
    app.patch('/api/admin/orders/:id', authenticateToken, isStaffOrAdmin, async (req, res) => {
        const { status, trackingNumber, assignedStaffId, internalNotes } = req.body;
        const { id } = req.params;
        try {
            await db.run(
                `UPDATE orders SET 
                    status = COALESCE(?, status), 
                    trackingNumber = COALESCE(?, trackingNumber),
                    assignedStaffId = COALESCE(?, assignedStaffId),
                    internalNotes = COALESCE(?, internalNotes)
                WHERE id = ?`,
                [status, trackingNumber, assignedStaffId, internalNotes, id]
            );
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Route: Add new product
    app.post('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
        const { name, category_name, price, unit, description, image, inStock, featured } = req.body;
        const id = uuidv4();
        try {
            await db.run(
                'INSERT INTO products (id, name, category_name, price, unit, description, image, inStock, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [id, name, category_name, price, unit, description, image, inStock ? 1 : 0, featured ? 1 : 0]
            );
            res.status(201).json({ success: true, id });
        } catch (error) {
            console.error('Add product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Route: Update product
    app.patch('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
        const { id } = req.params;
        const { name, category_name, price, unit, description, image, inStock, featured } = req.body;
        try {
            await db.run(
                `UPDATE products SET 
                    name = COALESCE(?, name),
                    category_name = COALESCE(?, category_name),
                    price = COALESCE(?, price),
                    unit = COALESCE(?, unit),
                    description = COALESCE(?, description),
                    image = COALESCE(?, image),
                    inStock = COALESCE(?, inStock),
                    featured = COALESCE(?, featured)
                WHERE id = ?`,
                [name, category_name, price, unit, description, image, inStock === undefined ? null : (inStock ? 1 : 0), featured === undefined ? null : (featured ? 1 : 0), id]
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Route: Delete product
    app.delete('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
        const { id } = req.params;
        try {
            await db.run('DELETE FROM products WHERE id = ?', [id]);
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // User Route: View personal orders
    app.get('/api/user/orders', authenticateToken, async (req: AuthRequest, res) => {
        try {
            const orders = await db.all('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [req.user?.id]);
            res.json(orders);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/user/orders/:id/items', authenticateToken, async (req: AuthRequest, res) => {
        const { id } = req.params;
        const userId = req.user?.id;
        try {
            // Verify order belongs to user
            const order = await db.get('SELECT id FROM orders WHERE id = ? AND userId = ?', [id, userId]);
            if (!order) return res.status(403).json({ error: 'Access denied' });

            const items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [id]);
            res.json(items);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // 404 Handler for API
    app.use('/api', (req, res) => {
        console.warn(`404 NOT FOUND: ${req.method} ${req.originalUrl}`);
        res.status(404).json({ error: `Endpoint ${req.originalUrl} not found on this server` });
    });

    // Global Error Handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error('Unhandled Server Error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    });

    // Serve static files from the React app build directory
    const frontendBuildPath = path.resolve(process.cwd(), '../dist');
    if (fs.existsSync(frontendBuildPath)) {
        app.use(express.static(frontendBuildPath));
        app.get('/(.*)', (req, res) => { // Use /(.*) instead of /:any*
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
});
    }

    app.listen(PORT, () => {
        console.log(`Backend running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
