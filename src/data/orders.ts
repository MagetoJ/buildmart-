export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Kamau",
    customerEmail: "john.kamau@email.com",
    items: [
      { productId: "1", productName: "Portland Cement", quantity: 50, price: 12.99 },
      { productId: "2", productName: "River Sand", quantity: 2, price: 45.00 }
    ],
    total: 739.50,
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "ORD-002",
    customerName: "Sarah Njeri",
    customerEmail: "sarah.njeri@email.com",
    items: [
      { productId: "3", productName: "Red Clay Bricks", quantity: 1000, price: 0.65 }
    ],
    total: 650.00,
    status: "processing",
    createdAt: "2024-01-14T14:20:00Z"
  },
  {
    id: "ORD-003",
    customerName: "David Omondi",
    customerEmail: "david.omondi@email.com",
    items: [
      { productId: "4", productName: "Ballast (20mm)", quantity: 5, price: 38.00 },
      { productId: "1", productName: "Portland Cement", quantity: 20, price: 12.99 }
    ],
    total: 449.80,
    status: "completed",
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "ORD-004",
    customerName: "Grace Wanjiku",
    customerEmail: "grace.wanjiku@email.com",
    items: [
      { productId: "5", productName: "Concrete Blocks", quantity: 200, price: 2.50 }
    ],
    total: 500.00,
    status: "pending",
    createdAt: "2024-01-12T16:45:00Z"
  },
  {
    id: "ORD-005",
    customerName: "Peter Mutua",
    customerEmail: "peter.mutua@email.com",
    items: [
      { productId: "6", productName: "White Cement", quantity: 10, price: 18.99 },
      { productId: "7", productName: "Plastering Sand", quantity: 3, price: 42.00 }
    ],
    total: 315.90,
    status: "completed",
    createdAt: "2024-01-11T11:30:00Z"
  },
  {
    id: "ORD-006",
    customerName: "Mary Akinyi",
    customerEmail: "mary.akinyi@email.com",
    items: [
      { productId: "3", productName: "Red Clay Bricks", quantity: 500, price: 0.65 },
      { productId: "1", productName: "Portland Cement", quantity: 30, price: 12.99 }
    ],
    total: 714.70,
    status: "completed",
    createdAt: "2024-01-10T13:00:00Z"
  }
];

export const salesMetrics = {
  totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  totalOrders: orders.length,
  pendingOrders: orders.filter(o => o.status === "pending").length,
  completedOrders: orders.filter(o => o.status === "completed").length,
  averageOrderValue: orders.reduce((sum, order) => sum + order.total, 0) / orders.length
};

export const dailySales = [
  { date: "Jan 10", revenue: 714.70, orders: 1 },
  { date: "Jan 11", revenue: 315.90, orders: 1 },
  { date: "Jan 12", revenue: 500.00, orders: 1 },
  { date: "Jan 13", revenue: 449.80, orders: 1 },
  { date: "Jan 14", revenue: 650.00, orders: 1 },
  { date: "Jan 15", revenue: 739.50, orders: 1 }
];

export const productSales = [
  { name: "Portland Cement", sales: 1189.90, units: 100 },
  { name: "Red Clay Bricks", sales: 975.00, units: 1500 },
  { name: "River Sand", sales: 90.00, units: 2 },
  { name: "Ballast (20mm)", sales: 190.00, units: 5 },
  { name: "Concrete Blocks", sales: 500.00, units: 200 },
  { name: "White Cement", sales: 189.90, units: 10 },
  { name: "Plastering Sand", sales: 126.00, units: 3 }
];
