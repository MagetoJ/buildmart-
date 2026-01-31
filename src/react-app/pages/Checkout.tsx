import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Loader2 } from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { useCart } from "@/react-app/contexts/CartContext";
import { useAuth } from "@/react-app/contexts/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    address: "",
    password: "", // for account creation
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: prev.full_name || user.full_name || "",
        email: prev.email || user.email || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);
  const [createAccount, setCreateAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalPrice,
        userId: user?.id || null,
        guestDetails: !user ? formData : null,
        createAccount: !user && createAccount,
        // Fallback for simple checkout if not guest/createAcc logic
        customerName: formData.full_name,
        customerEmail: formData.email,
        deliveryAddress: formData.address
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // This will open WhatsApp on the user's phone/computer to send the message to the admin
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
          alert("Order Placed! Redirecting to WhatsApp to notify admin...");
        } else {
          alert(`Order successful! Order ID: ${data.orderId}`);
        }
        clearCart();
        navigate("/");
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Truck className="w-6 h-6 text-orange-600" />
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Delivery Address</label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="Enter your full street address, city, and zip code"
                  ></textarea>
                </div>

                {!user && (
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="createAccount"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="w-5 h-5 accent-orange-600"
                      />
                      <label htmlFor="createAccount" className="font-semibold text-gray-900">
                        Create an account for faster checkout next time?
                      </label>
                    </div>
                    {createAccount && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Choose Password</label>
                        <input
                          type="password"
                          name="password"
                          required={createAccount}
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white"
                          placeholder="••••••••"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                    Payment Method
                  </h3>
                  <div className="p-6 border-2 border-orange-600 bg-orange-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Truck className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when you receive your materials</div>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-orange-600 bg-orange-600"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-8"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-6 h-6" />
                      Place Order (${totalPrice.toFixed(2)})
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="text-gray-600">
                      <span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}
                    </div>
                    <div className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
