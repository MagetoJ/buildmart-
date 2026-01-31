import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { useComparison } from "@/react-app/contexts/ComparisonContext";
import { X, ArrowLeft, ShoppingCart, Info, Scale } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useCart } from "@/react-app/contexts/CartContext";

export default function ComparePage() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Scale className="w-8 h-8 text-orange-600" />
                Product Comparison
              </h1>
              <p className="text-gray-600">Compare technical specifications and prices</p>
            </div>
          </div>
          
          {comparisonList.length > 0 && (
            <button 
              onClick={clearComparison}
              className="px-6 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Clear All
            </button>
          )}
        </div>

        {comparisonList.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-8 text-left min-w-[250px] border-b border-gray-100">
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Features</div>
                    </th>
                    {comparisonList.map((product) => (
                      <th key={product.id} className="p-8 min-w-[300px] border-b border-gray-100 border-l relative group">
                        <button 
                          onClick={() => removeFromComparison(product.id)}
                          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col items-center text-center">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-32 h-32 object-cover rounded-2xl mb-4 shadow-sm"
                          />
                          <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                          <div className="text-2xl font-bold text-orange-600">${product.price.toFixed(2)}</div>
                          <div className="text-sm text-gray-500 mb-6">{product.unit}</div>
                          <button 
                            onClick={() => addToCart(product, 1)}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* Placeholder columns if less than 4 */}
                    {[...Array(Math.max(0, 4 - comparisonList.length))].map((_, i) => (
                      <th key={`empty-${i}`} className="p-8 min-w-[300px] border-b border-gray-100 border-l bg-gray-50/20">
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                          <Link to="/products" className="group flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-orange-300 transition-colors">
                              <Scale className="w-8 h-8 opacity-20" />
                            </div>
                            <span className="font-semibold text-sm group-hover:text-orange-600">Add Product</span>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-8 font-bold text-gray-900 bg-gray-50/30 flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      Category
                    </td>
                    {comparisonList.map((product) => (
                      <td key={product.id} className="p-8 text-center text-gray-600 border-l border-gray-100">
                        {product.category_name}
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - comparisonList.length))].map((_, i) => (
                      <td key={`empty-cat-${i}`} className="p-8 border-l border-gray-100 bg-gray-50/10"></td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-8 font-bold text-gray-900 bg-gray-50/30 flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      Status
                    </td>
                    {comparisonList.map((product) => (
                      <td key={product.id} className="p-8 text-center border-l border-gray-100">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - comparisonList.length))].map((_, i) => (
                      <td key={`empty-stock-${i}`} className="p-8 border-l border-gray-100 bg-gray-50/10"></td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-8 font-bold text-gray-900 bg-gray-50/30 flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      Description
                    </td>
                    {comparisonList.map((product) => (
                      <td key={product.id} className="p-8 text-sm text-gray-500 border-l border-gray-100 leading-relaxed min-w-[300px]">
                        {product.description}
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - comparisonList.length))].map((_, i) => (
                      <td key={`empty-desc-${i}`} className="p-8 border-l border-gray-100 bg-gray-50/10"></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl border border-gray-100">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Scale className="w-12 h-12 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No products to compare</h2>
            <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto">
              Add at least two products from our catalog to see their differences side-by-side.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
