import { ShoppingCart, Heart, Scale } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { Product } from "@/shared/types";
import { useCart } from "@/react-app/contexts/CartContext";
import { useWishlist } from "@/react-app/contexts/WishlistContext";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { useComparison } from "@/react-app/contexts/ComparisonContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const toggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const isLiked = isInWishlist(product.id);
  const isCompared = isInComparison(product.id);

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 block">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
            Out of Stock
          </div>
        )}
        {product.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-semibold rounded-full">
            Featured
          </div>
        )}
        <button
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
            isLiked
              ? "bg-red-50 text-red-600 opacity-100"
              : "bg-white/90 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={toggleComparison}
          className={`absolute top-16 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
            isCompared
              ? "bg-orange-50 text-orange-600 opacity-100"
              : "bg-white/90 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white"
          }`}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
        >
          <Scale className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="text-sm text-orange-600 font-semibold mb-2">{product.category_name}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              ${product.price}
            </div>
            <div className="text-sm text-gray-500">{product.unit}</div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </Link>
  );
}
