import { ShoppingCart, Search, User, Menu, LogOut, X, Heart, Scale, Rocket, CheckCircle2, Database } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useCart } from "@/react-app/contexts/CartContext";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { useWishlist } from "@/react-app/contexts/WishlistContext";
import { useComparison } from "@/react-app/contexts/ComparisonContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { comparisonList } = useComparison();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string, name: string, description: string, image: string, price: number }[]>([]);
  const [backendStatus, setBackendStatus] = useState<{ status: string, db: string } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus(data);
        }
      } catch {
        setBackendStatus(null);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length > 2) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data);
          }
        } catch (error) {
          console.error("Search failed:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      {/* Connection Status Bar */}
      <div className="bg-gray-900 text-[10px] text-white py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Backend:</span>
              {backendStatus?.status === 'ok' ? (
                <span className="text-green-400 flex items-center gap-0.5 font-bold uppercase tracking-wider">
                  <Rocket className="w-3 h-3 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-0.5 font-bold uppercase tracking-wider">
                  Offline
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Database:</span>
              {backendStatus?.db === 'sqlite' ? (
                <span className="text-green-400 flex items-center gap-0.5 font-bold uppercase tracking-wider">
                  <Database className="w-3 h-3" />
                  SQLite
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-0.5 font-bold uppercase tracking-wider">
                  Disconnected
                </span>
              )}
            </div>
          </div>
          <div className="hidden sm:block text-gray-500 font-medium">
            Authorized Personnel Only
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">FS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">frah spaces</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Contact
            </Link>
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <div className="flex items-center gap-6 border-l pl-6 border-gray-200 ml-2">
                <Link to="/admin" className="text-orange-600 hover:text-orange-700 font-bold text-sm uppercase tracking-wider">
                  Dashboard
                </Link>
                <Link to="/admin/orders" className="text-gray-700 hover:text-orange-600 font-bold text-sm uppercase tracking-wider">
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/products" className="text-gray-700 hover:text-orange-600 font-bold text-sm uppercase tracking-wider">
                      Products
                    </Link>
                    <Link to="/admin/categories" className="text-gray-700 hover:text-orange-600 font-bold text-sm uppercase tracking-wider">
                      Categories
                    </Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-orange-600 font-bold text-sm uppercase tracking-wider">
                      Users
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-100 rounded-full transition-all">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs border border-orange-200">
                    {user.full_name?.[0] || user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                    {user.full_name?.split(' ')[0] || user.username}
                  </span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Login">
                <User className="w-5 h-5 text-gray-700" />
              </Link>
            )}

            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" title="Wishlist">
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/compare" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" title="Compare Products">
              <Scale className="w-5 h-5 text-gray-700" />
              {comparisonList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {comparisonList.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in fade-in duration-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-12">
              <span className="text-2xl font-bold text-gray-900">Search frah spaces</span>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-8 h-8 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-orange-600" />
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you building today?"
                  className="w-full pl-20 pr-8 py-8 text-3xl font-medium border-b-4 border-gray-100 focus:border-orange-600 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <p className="mt-6 text-gray-500 text-lg">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-bold">ESC</kbd> to close or <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-bold">ENTER</kbd> to search
              </p>

              {searchResults.length > 0 && (
                <div className="mt-12 grid gap-6">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-6 p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-gray-500 line-clamp-1">{product.description}</p>
                        <div className="mt-1 font-bold text-orange-600">KES {product.price.toFixed(2)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
