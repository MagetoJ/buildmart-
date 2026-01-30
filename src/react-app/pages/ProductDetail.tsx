import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Package, Truck, Shield } from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import ProductCard from "@/react-app/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/react-app/contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-lg mb-12">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
            {!product.inStock && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-full">
                Out of Stock
              </div>
            )}
            {product.featured && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-full">
                Featured
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-sm text-orange-600 font-semibold mb-2">{product.category}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-6">
              <div className="text-5xl font-bold text-gray-900">${product.price}</div>
              <div className="text-xl text-gray-500">{product.unit}</div>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Quality Assured</div>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Fast Delivery</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Guaranteed</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={!product.inStock}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center text-lg font-semibold border-x-2 border-gray-300 py-3"
                    disabled={!product.inStock}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={!product.inStock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(product.price * quantity).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-6 h-6" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-orange-600 hover:bg-orange-50 transition-colors">
                <Heart className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
