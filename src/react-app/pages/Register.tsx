import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join frah spaces</h1>
            <p className="text-gray-600 mb-8">Create an account to start building</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-left">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
