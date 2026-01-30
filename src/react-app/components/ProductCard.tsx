import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router";
import type { Product } from "@/data/products";
import { useCart } from "@/react-app/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

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
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Heart className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="p-6">
        <div className="text-sm text-orange-600 font-semibold mb-2">{product.category}</div>
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
