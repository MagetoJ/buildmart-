import { useState, useEffect, useCallback } from "react";
import { 
  Users, Search, Filter, UserPlus, Shield, 
  Trash2, Edit2, Mail, MapPin, Calendar, 
  Check, X, Loader2
} from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { useAuth } from "@/react-app/contexts/AuthContext";

interface User {
  id: string;
  username: string | null;
  email: string;
  role: 'admin' | 'staff' | 'user';
  full_name: string | null;
  address: string | null;
  profile_image: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff" as User['role'],
    full_name: "",
    address: ""
  });

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateUser = async (userId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, ...editForm } : u));
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        fetchUsers();
        setShowAddModal(false);
        setNewUser({ username: "", email: "", password: "", role: "staff", full_name: "", address: "" });
      }
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    staff: "bg-blue-100 text-blue-800",
    user: "bg-gray-100 text-gray-800"
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-lg text-gray-600">Control access and manage user profiles</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add Staff Member
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, Email or Username..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Role Filter</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none transition-colors appearance-none"
                >
                  <option value="All">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="user">Customer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact & Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={editForm.full_name || ""}
                              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                              className="px-2 py-1 border rounded text-sm focus:outline-none focus:border-orange-500"
                            />
                          ) : (
                            <div className="font-bold text-gray-900">{user.full_name || "N/A"}</div>
                          )}
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user.id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as User['role'] })}
                          className="px-2 py-1 border rounded text-sm focus:outline-none focus:border-orange-500"
                        >
                          <option value="user">Customer</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${roleColors[user.role]}`}>
                          <Shield className="w-3 h-3" />
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3.5 h-3.5" />
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={editForm.address || ""}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              className="px-2 py-1 border rounded text-xs focus:outline-none focus:border-orange-500 w-full"
                            />
                          ) : (
                            <span className="truncate max-w-[200px]">{user.address || "No address provided"}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateUser(user.id)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                              title="Save"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser(user.id);
                                setEditForm({ role: user.role, full_name: user.full_name, address: user.address });
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-medium">No users found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Staff Member</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="john@frahspaces.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="********"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
