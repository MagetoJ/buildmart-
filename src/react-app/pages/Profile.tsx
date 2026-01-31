import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { User, Package, Settings, LogOut, ChevronRight, Clock, Loader2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/react-app/contexts/AuthContext";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  address: string | null;
  role: 'admin' | 'staff' | 'user';
  profile_image: string | null;
  created_at: string;
}

interface OrderItem {
  id: number;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  trackingNumber?: string;
}

export default function ProfilePage() {
  const { token, logout, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [updateForm, setUpdateForm] = useState({ full_name: "", address: "" });
  const [updating, setUpdating] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setUpdateForm({ full_name: data.full_name || "", address: data.address || "" });
      } else {
        console.error("Failed to fetch profile:", res.status);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
      return;
    }

    if (token) {
      fetchProfile();

      // Fetch User Orders
      fetch("/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setOrdersLoading(false);
        })
        .catch(() => setOrdersLoading(false));
    }
  }, [token, authLoading, navigate, fetchProfile]);

  const fetchOrderItems = async (orderId: string) => {
    if (orderItems[orderId] || !token) return;

    try {
      const response = await fetch(`/api/user/orders/${orderId}/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrderItems(prev => ({ ...prev, [orderId]: data }));
      }
    } catch (error) {
      console.error('Failed to fetch order items:', error);
    }
  };

  const toggleExpand = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      fetchOrderItems(orderId);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch("/api/profile", {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updateForm)
      });
      if (response.ok) {
        await fetchProfile();
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Unavailable</h2>
            <p className="text-gray-600 mb-6">We couldn't load your profile information. Please try logging in again.</p>
            <button 
              onClick={() => { logout(); navigate("/login"); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
            >
              Back to Login
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayUser = {
    name: profile.full_name || profile.username,
    email: profile.email,
    avatar: profile.profile_image || `https://ui-avatars.com/api/?name=${profile.full_name || profile.username}&background=f97316&color=fff`,
    joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    totalOrders: orders.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 text-center border-b border-gray-100">
                <img
                  src={displayUser.avatar}
                  alt={displayUser.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-100"
                />
                <h2 className="text-xl font-bold text-gray-900">{displayUser.name}</h2>
                <p className="text-gray-500 text-sm">{displayUser.email}</p>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl font-semibold transition-all ${activeTab === 'overview' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5" />
                        <span>Account Overview</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl font-semibold transition-all ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl font-semibold transition-all ${activeTab === 'settings' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </li>
                  <li className="pt-4 mt-4 border-t border-gray-100">
                    <button 
                      onClick={() => { logout(); navigate("/"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Sign Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1 font-medium">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-900">{displayUser.totalOrders}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1 font-medium">Account Status</div>
                    <div className="text-2xl font-bold text-green-600">{profile.role === 'admin' ? 'Master Admin' : profile.role === 'staff' ? 'Staff Builder' : 'Premium Builder'}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1 font-medium">Member Since</div>
                    <div className="text-2xl font-bold text-gray-900">{displayUser.joinDate}</div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                        <p className="text-lg font-semibold text-gray-900">{profile.full_name || "Not set"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Default Address</label>
                        <p className="text-lg font-semibold text-gray-900">{profile.address || "No address saved"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              /* Recent Orders */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    My Orders
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ordersLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : orders.length > 0 ? (
                        orders.map((order) => (
                          <React.Fragment key={order.id}>
                            <tr 
                              className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedOrderId === order.id ? 'bg-orange-50/30' : ''}`}
                              onClick={() => toggleExpand(order.id)}
                            >
                              <td className="px-6 py-4 font-bold text-gray-900">
                                <div>{order.id}</div>
                                {order.trackingNumber && (
                                  <div className="text-[10px] text-orange-600 uppercase tracking-wider mt-1">
                                    Track: {order.trackingNumber}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-gray-900 font-semibold">${order.total.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                  order.status === "delivered" 
                                    ? "bg-green-100 text-green-700" 
                                    : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "processing"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="text-gray-400 hover:text-orange-600 transition-colors">
                                  {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                              </td>
                            </tr>
                            {expandedOrderId === order.id && (
                              <tr>
                                <td colSpan={5} className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                                  <div className="animate-in slide-in-from-top-2 duration-200">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                                    <div className="space-y-3">
                                      {orderItems[order.id] ? (
                                        orderItems[order.id].map((item) => (
                                          <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                              <span className="font-semibold text-gray-900">{item.productName}</span>
                                              <span className="text-gray-400">x{item.quantity}</span>
                                            </div>
                                            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="flex justify-center py-2">
                                          <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
                                        </div>
                                      )}
                                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Total Amount</span>
                                        <span className="text-lg font-bold text-orange-600">${order.total.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                            You haven't placed any orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={updateForm.full_name}
                      onChange={(e) => setUpdateForm({ ...updateForm, full_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                    <textarea
                      value={updateForm.address}
                      onChange={(e) => setUpdateForm({ ...updateForm, address: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                      rows={3}
                      placeholder="Your default delivery address"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
