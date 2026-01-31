import { Product } from "@/shared/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Portland Cement",
    category_name: "Cement",
    price: 12.99,
    unit: "per bag (50kg)",
    description: "High-quality Portland cement ideal for all construction projects",
    image: "https://images.unsplash.com/photo-1581092160607-ee67e4e6a4c5?w=800&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "2",
    name: "River Sand",
    category_name: "Sand",
    price: 45.00,
    unit: "per ton",
    description: "Premium washed river sand for concrete and masonry work",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "3",
    name: "Red Clay Bricks",
    category_name: "Bricks",
    price: 0.65,
    unit: "per piece",
    description: "Durable red clay bricks for construction and landscaping",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "Ballast (20mm)",
    category_name: "Aggregates",
    price: 38.00,
    unit: "per ton",
    description: "20mm ballast ideal for concrete mixing and foundation work",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "5",
    name: "Concrete Blocks",
    category_name: "Blocks",
    price: 2.50,
    unit: "per piece",
    description: "Standard concrete blocks for walls and partitions",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
    inStock: true,
    featured: false
  },
  {
    id: "6",
    name: "White Cement",
    category_name: "Cement",
    price: 18.99,
    unit: "per bag (25kg)",
    description: "Premium white cement for finishing and decorative work",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80",
    inStock: true,
    featured: false
  },
  {
    id: "7",
    name: "Plastering Sand",
    category_name: "Sand",
    price: 42.00,
    unit: "per ton",
    description: "Fine sand perfect for plastering and rendering",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    inStock: true,
    featured: false
  },
  {
    id: "8",
    name: "Paving Bricks",
    category_name: "Bricks",
    price: 0.85,
    unit: "per piece",
    description: "Interlocking paving bricks for driveways and walkways",
    image: "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80",
    inStock: false,
    featured: false
  }
];

export const categories = [
  { name: "Cement", icon: "Package" },
  { name: "Sand", icon: "Mountain" },
  { name: "Bricks", icon: "Grid3x3" },
  { name: "Aggregates", icon: "Circle" },
  { name: "Blocks", icon: "Box" }
];
