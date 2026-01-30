import { BrowserRouter as Router, Routes, Route } from "react-router";
import { CartProvider } from "@/react-app/contexts/CartContext";
import HomePage from "@/react-app/pages/Home";
import ProductDetail from "@/react-app/pages/ProductDetail";
import Cart from "@/react-app/pages/Cart";
import AdminDashboard from "@/react-app/pages/AdminDashboard";
import AdminProducts from "@/react-app/pages/AdminProducts";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
