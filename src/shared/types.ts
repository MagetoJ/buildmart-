export interface Product {
  id: string;
  name: string;
  category_name: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  inStock: boolean;
  featured: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
    id: string;
    username?: string;
    email: string;
    role: 'admin' | 'staff' | 'user';
    full_name?: string;
    address?: string;
    profile_image?: string;
    created_at: string;
}
