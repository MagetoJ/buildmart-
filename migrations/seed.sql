-- Seed Users
INSERT INTO users (id, username, email, password, role, full_name, address) VALUES 
('admin-uuid', 'admin', 'admin@buildmart.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'admin', 'System Admin', '123 Admin Way'),
('staff-uuid', 'staff', 'staff@buildmart.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'staff', 'Store Manager', '456 Staff Ave'),
('user-uuid', 'user', 'user@buildmart.com', '$2b$12$wx0QiPmNd1lyeMQs/w8wmOE.4ESuEM2n8madlSPmUkDKYaejuMyWq', 'user', 'Regular Customer', '789 User Blvd');

-- Seed Categories
INSERT INTO categories (name, icon) VALUES ('Cement', 'Package');
INSERT INTO categories (name, icon) VALUES ('Sand', 'Mountain');
INSERT INTO categories (name, icon) VALUES ('Bricks', 'Grid3x3');
INSERT INTO categories (name, icon) VALUES ('Aggregates', 'Circle');
INSERT INTO categories (name, icon) VALUES ('Blocks', 'Box');

-- Seed Products
INSERT INTO products (id, name, category_name, price, unit, description, image, inStock, featured) VALUES 
('1', 'Portland Cement', 'Cement', 12.99, 'per bag (50kg)', 'High-quality Portland cement ideal for all construction projects', 'https://images.unsplash.com/photo-1581092160607-ee67e4e6a4c5?w=800&q=80', 1, 1),
('2', 'River Sand', 'Sand', 45.00, 'per ton', 'Premium washed river sand for concrete and masonry work', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', 1, 1),
('3', 'Red Clay Bricks', 'Bricks', 0.65, 'per piece', 'Durable red clay bricks for construction and landscaping', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 1, 1),
('4', 'Ballast (20mm)', 'Aggregates', 38.00, 'per ton', '20mm ballast ideal for concrete mixing and foundation work', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80', 1, 1),
('5', 'Concrete Blocks', 'Blocks', 2.50, 'per piece', 'Standard concrete blocks for walls and partitions', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80', 1, 0),
('6', 'White Cement', 'Cement', 18.99, 'per bag (25kg)', 'Premium white cement for finishing and decorative work', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', 1, 0),
('7', 'Plastering Sand', 'Sand', 42.00, 'per ton', 'Fine sand perfect for plastering and rendering', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', 1, 0),
('8', 'Paving Bricks', 'Bricks', 0.85, 'per piece', 'Interlocking paving bricks for driveways and walkways', 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80', 0, 0);

-- Seed Orders
INSERT INTO orders (id, userId, customerName, customerEmail, deliveryAddress, total, status, createdAt) VALUES 
('ORD-001', 'user-uuid', 'Regular Customer', 'user@buildmart.com', '789 User Blvd', 739.50, 'delivered', '2024-01-15T10:30:00Z'),
('ORD-002', NULL, 'Sarah Njeri', 'sarah.njeri@email.com', '456 Park Ave, Mombasa', 650.00, 'processing', '2024-01-14T14:20:00Z'),
('ORD-003', 'user-uuid', 'Regular Customer', 'user@buildmart.com', '789 User Blvd', 449.80, 'delivered', '2024-01-13T09:15:00Z'),
('ORD-004', NULL, 'Grace Wanjiku', 'grace.wanjiku@email.com', '321 Hill St, Nakuru', 500.00, 'pending', '2024-01-12T16:45:00Z'),
('ORD-005', 'user-uuid', 'Regular Customer', 'user@buildmart.com', '789 User Blvd', 315.90, 'delivered', '2024-01-11T11:30:00Z'),
('ORD-006', NULL, 'Mary Akinyi', 'mary.akinyi@email.com', '987 Beach Dr, Diani', 714.70, 'delivered', '2024-01-10T13:00:00Z');

-- Seed Order Items
INSERT INTO order_items (orderId, productId, productName, quantity, price) VALUES 
('ORD-001', '1', 'Portland Cement', 50, 12.99),
('ORD-001', '2', 'River Sand', 2, 45.00),
('ORD-002', '3', 'Red Clay Bricks', 1000, 0.65),
('ORD-003', '4', 'Ballast (20mm)', 5, 38.00),
('ORD-003', '1', 'Portland Cement', 20, 12.99),
('ORD-004', '5', 'Concrete Blocks', 200, 2.50),
('ORD-005', '6', 'White Cement', 10, 18.99),
('ORD-005', '7', 'Plastering Sand', 3, 42.00),
('ORD-006', '3', 'Red Clay Bricks', 500, 0.65),
('ORD-006', '1', 'Portland Cement', 30, 12.99);
