import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Package, Truck, Shield, Star, MessageSquare, Scale } from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import ProductCard from "@/react-app/components/ProductCard";
import { Product, Review } from "@/shared/types";
import { useCart } from "@/react-app/contexts/CartContext";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { useWishlist } from "@/react-app/contexts/WishlistContext";
import { useComparison } from "@/react-app/contexts/ComparisonContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch(`/api/products/${id}/reviews`).then(res => res.json())
    ]).then(([productsData, reviewsData]) => {
      setProducts(productsData);
      const foundProduct = productsData.find((p: Product) => p.id === id);
      setProduct(foundProduct || null);
      setReviews(reviewsData);
      setLoading(false);
    });
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    setSubmittingReview(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (response.ok) {
        setReviewComment("");
        setReviewRating(5);
        // Refresh reviews
        const res = await fetch(`/api/products/${id}/reviews`);
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user || !product) {
      if (!user) navigate("/login");
      return;
    }

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const toggleComparison = () => {
    if (!product) return;
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const isLiked = product ? isInWishlist(product.id) : false;
  const isCompared = product ? isInComparison(product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </div>
    );
  }

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
    p => p.category_name === product.category_name && p.id !== product.id
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
            <div className="text-sm text-orange-600 font-semibold mb-2">{product.category_name}</div>
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
              <button
                onClick={toggleWishlist}
                className={`p-4 border-2 rounded-xl transition-colors ${
                  isLiked
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-gray-300 hover:border-orange-600 hover:bg-orange-50 text-gray-700"
                }`}
                title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={toggleComparison}
                className={`p-4 border-2 rounded-xl transition-colors ${
                  isCompared
                    ? "border-orange-600 bg-orange-50 text-orange-600"
                    : "border-gray-300 hover:border-orange-600 hover:bg-orange-50 text-gray-700"
                }`}
                title={isCompared ? "Remove from comparison" : "Add to comparison"}
              >
                <Scale className="w-6 h-6" />
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

        {/* Reviews Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-gray-600 font-medium">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold text-gray-900">{review.userName}</div>
                        <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex text-orange-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`p-1 transition-colors ${reviewRating >= star ? 'text-orange-400' : 'text-gray-300'}`}
                          >
                            <Star className={`w-8 h-8 ${reviewRating >= star ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Comment</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        rows={4}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="Share your experience with this product..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                      {submittingReview ? "Submitting..." : "Post Review"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Please log in to leave a review.</p>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Log In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
