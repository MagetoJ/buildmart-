import { useState, useEffect, useCallback } from "react";
import { 
  Package, Search, Filter, ChevronDown, ChevronUp, 
  Truck, CheckCircle, Clock, XCircle, Info, User, 
  MapPin, Mail, Loader2 
} from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { useAuth } from "@/react-app/contexts/AuthContext";

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
  userId: string | null;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string | null;
  assignedStaffId: string | null;
  internalNotes: string | null;
  createdAt: string;
  clientName?: string;
  clientEmail?: string;
}

interface Staff {
  id: string;
  full_name: string;
  role: string;
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [ordersRes, staffRes] = await Promise.all([
        fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/staff', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (ordersRes.ok && staffRes.ok) {
        const ordersData = await ordersRes.json();
        const staffData = await staffRes.json();
        setOrders(ordersData);
        setStaff(staffData);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchOrderItems = async (orderId: string) => {
    if (orderItems[orderId] || !token) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/items`, {
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

  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o));
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    processing: <Info className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-lg text-gray-600">Track and fulfill customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Order ID, Customer Name or Email..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status Filter</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none transition-colors appearance-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all">
              <div 
                className={`p-6 cursor-pointer hover:bg-gray-50 flex flex-wrap items-center justify-between gap-4 ${expandedOrderId === order.id ? 'bg-orange-50/30' : ''}`}
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">{order.id}</div>
                    <div className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <div className="font-semibold text-gray-900">{order.customerName}</div>
                  <div className="text-gray-500 text-sm">{order.customerEmail}</div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 ${statusColors[order.status]}`}>
                    {statusIcons[order.status]}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div>
                  {expandedOrderId === order.id ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="p-6 border-t border-gray-100 bg-white">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Customer & Shipping Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">{order.customerName}</div>
                              {order.userId && <div className="text-xs text-orange-600 font-semibold">Registered User</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>{order.customerEmail}</span>
                          </div>
                          <div className="flex items-start gap-3 text-gray-600">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <span>{order.deliveryAddress}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Internal Management</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Assign Staff</label>
                            <select
                              value={order.assignedStaffId || ""}
                              onChange={(e) => handleUpdateOrder(order.id, { assignedStaffId: e.target.value || null })}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                            >
                              <option value="">Unassigned</option>
                              {staff.map(s => (
                                <option key={s.id} value={s.id}>{s.full_name} ({s.role})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Tracking Number</label>
                            <input
                              type="text"
                              value={order.trackingNumber || ""}
                              onChange={(e) => handleUpdateOrder(order.id, { trackingNumber: e.target.value || null })}
                              placeholder="Enter tracking #"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Internal Notes</label>
                            <textarea
                              value={order.internalNotes || ""}
                              onChange={(e) => handleUpdateOrder(order.id, { internalNotes: e.target.value || null })}
                              rows={2}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                              placeholder="Notes for staff..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Order Items</h3>
                        <span className="text-xs font-medium text-gray-500">{orderItems[order.id]?.length || 0} items</span>
                      </div>
                      <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                        <table className="w-full text-left">
                          <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-xs font-bold text-gray-500">Product</th>
                              <th className="px-4 py-3 text-xs font-bold text-gray-500">Price</th>
                              <th className="px-4 py-3 text-xs font-bold text-gray-500">Qty</th>
                              <th className="px-4 py-3 text-xs font-bold text-gray-500 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orderItems[order.id]?.map(item => (
                              <tr key={item.id}>
                                <td className="px-4 py-3 font-medium text-gray-900">{item.productName}</td>
                                <td className="px-4 py-3 text-gray-600">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-gray-600">x{item.quantity}</td>
                                <td className="px-4 py-3 text-gray-900 font-bold text-right">${(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-100">
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">Total Amount</td>
                              <td className="px-4 py-3 text-lg font-bold text-orange-600 text-right">${order.total.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-4">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Update Status</h3>
                          <div className="flex flex-wrap gap-2">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateOrder(order.id, { status: status as Order['status'] })}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                                  order.status === status 
                                    ? "bg-orange-600 border-orange-600 text-white shadow-lg" 
                                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-medium">No orders found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
