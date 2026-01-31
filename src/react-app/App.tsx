import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import { CartProvider } from "@/react-app/contexts/CartContext";
import { AuthProvider } from "@/react-app/contexts/AuthContext";
import { WishlistProvider } from "@/react-app/contexts/WishlistContext";
import { ComparisonProvider } from "@/react-app/contexts/ComparisonContext";
import HomePage from "@/react-app/pages/Home";
import ProductDetail from "@/react-app/pages/ProductDetail";
import ProductsPage from "@/react-app/pages/Products";
import AboutPage from "@/react-app/pages/About";
import ContactPage from "@/react-app/pages/Contact";
import ProfilePage from "@/react-app/pages/Profile";
import LoginPage from "@/react-app/pages/Login";
import RegisterPage from "@/react-app/pages/Register";
import CheckoutPage from "@/react-app/pages/Checkout";
import Cart from "@/react-app/pages/Cart";
import WishlistPage from "@/react-app/pages/Wishlist";
import ComparePage from "@/react-app/pages/Compare";
import AdminDashboard from "@/react-app/pages/AdminDashboard";
import AdminProducts from "@/react-app/pages/AdminProducts";
import AdminOrders from "@/react-app/pages/AdminOrders";
import AdminUsers from "@/react-app/pages/AdminUsers";
import AdminCategories from "@/react-app/pages/AdminCategories";

function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitor_id', visitorId);
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname,
        visitorId
      })
    }).catch(err => console.error('Failed to track visit:', err));
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <ComparisonProvider>
          <CartProvider>
            <Router>
              <VisitorTracker />
              <Routes>
                <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
            </Routes>
          </Router>
        </CartProvider>
      </ComparisonProvider>
    </WishlistProvider>
  </AuthProvider>
  );
}
