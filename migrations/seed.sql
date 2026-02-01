-- Seed Users
INSERT INTO users (id, username, email, password, role, full_name, address) VALUES 
('admin-uuid', 'admin', 'admin@frahspaces.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'admin', 'System Admin', 'Nairobi, Kenya'),
('staff-uuid', 'staff', 'staff@frahspaces.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'staff', 'Store Manager', 'Mombasa Road, Nairobi'),
('user-uuid', 'user', 'user@frahspaces.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'user', 'Regular Customer', 'Westlands, Nairobi'),
('admin2-uuid', 'admin2', 'admin2@frahspaces.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'admin', 'Super Admin', 'Nairobi, Kenya'),
('admin-2-id', 'manager_one', 'manager@frahspaces.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'admin', 'Project Manager', 'Nairobi HQ'),
('admin-final-id', 'superadmin', 'superadmin@frahspaces.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'admin', 'Frah Spaces Admin', 'Industrial Area, Nairobi');

-- Seed Categories
INSERT INTO categories (name, icon) VALUES ('Cement', 'Package');
INSERT INTO categories (name, icon) VALUES ('Sand', 'Mountain');
INSERT INTO categories (name, icon) VALUES ('Bricks', 'Grid3x3');
INSERT INTO categories (name, icon) VALUES ('Aggregates', 'Circle');
INSERT INTO categories (name, icon) VALUES ('Blocks', 'Box');
INSERT INTO categories (name, icon) VALUES ('Timber', 'Trees');
INSERT INTO categories (name, icon) VALUES ('Steel', 'Activity');
INSERT INTO categories (name, icon) VALUES ('Roofing', 'Home');

-- Seed Products (Prices in KES)
INSERT INTO products (id, name, category_name, price, unit, description, image, inStock, featured) VALUES 
('1', 'Bamburi Tembo Cement', 'Cement', 780.00, 'per bag (50kg)', 'High-strength Bamburi Tembo cement for general purpose construction.', 'https://images.unsplash.com/photo-1581092160607-ee67e4e6a4c5?w=800&q=80', 1, 1),
('2', 'Machakos River Sand', 'Sand', 2800.00, 'per ton', 'Clean, sharp river sand from Machakos, ideal for concrete work.', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', 1, 1),
('3', 'Machine Cut Clay Bricks', 'Bricks', 12.00, 'per piece', 'Quality machine-cut red clay bricks for durable wall construction.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 1, 1),
('4', 'Crushed Ballast (3/4 inch)', 'Aggregates', 2200.00, 'per ton', 'Standard 3/4 inch crushed ballast for high-quality concrete mixing.', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80', 1, 1),
('5', 'Hollow Concrete Blocks (9x9x18)', 'Blocks', 85.00, 'per piece', 'Large hollow concrete blocks for perimeter walls and heavy masonry.', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80', 1, 0),
('6', 'Blue Triangle White Cement', 'Cement', 1250.00, 'per bag (25kg)', 'Specialty white cement for decorative finishing and tile grouting.', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', 1, 0),
('7', 'Building Timber (2x2 Treated)', 'Timber', 65.00, 'per foot', 'Pressure-treated softwood timber for roofing and structural framing.', 'https://images.unsplash.com/photo-1520156154266-2c699564619d?w=800&q=80', 1, 1),
('8', 'Paving Cabro (Heavy Duty)', 'Bricks', 45.00, 'per piece', 'Heavy-duty interlocking cabro blocks for driveways and industrial yards.', 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80', 1, 0),
('9', 'TMT Deformed Steel Bars (12mm)', 'Steel', 1450.00, 'per bar (12m)', 'High-tensile TMT steel bars for structural reinforcement in concrete.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', 1, 1),
('10', 'Rhino Iron Sheets (G30)', 'Roofing', 1150.00, 'per sheet (3m)', 'Durable prepainted G30 iron sheets for roofing and wall cladding.', 'https://images.unsplash.com/photo-1635424710928-0544e8512eae?w=800&q=80', 1, 1);

-- Seed Orders
INSERT INTO orders (id, userId, customerName, customerEmail, deliveryAddress, total, status, createdAt) VALUES 
('ORD-001', 'user-uuid', 'Regular Customer', 'user@frahspaces.com', 'Westlands, Nairobi', 45000.00, 'delivered', '2024-01-15T10:30:00Z'),
('ORD-002', NULL, 'Jane Kamau', 'jane.kamau@email.com', 'Karen, Nairobi', 12500.00, 'processing', '2024-01-14T14:20:00Z');

-- Seed Order Items
INSERT INTO order_items (orderId, productId, productName, quantity, price) VALUES 
('ORD-001', '1', 'Bamburi Tembo Cement', 50, 780.00),
('ORD-001', '2', 'Machakos River Sand', 2, 2800.00),
('ORD-002', '3', 'Machine Cut Clay Bricks', 1000, 12.00);
