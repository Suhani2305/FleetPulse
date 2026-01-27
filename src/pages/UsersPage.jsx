import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    // Search and Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Admin' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

    const fetchUsers = async () => {
        setIsFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setUsers(data.users);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenAddModal = () => {
        setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'Admin' });
        setIsEditing(false);
        setEditUserId(null);
        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const handleEditClick = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            confirmPassword: '',
            role: user.role
        });
        setIsEditing(true);
        setEditUserId(user._id);
        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();

        // Password Match Validation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = isEditing
                ? `${API_BASE_URL}/api/v1/auth/users/${editUserId}`
                : `${API_BASE_URL}/api/v1/auth/register`;

            const method = isEditing ? 'PUT' : 'POST';

            // For editing, only send password if it's not empty
            const payload = { ...formData };
            if (isEditing && !payload.password) {
                delete payload.password;
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: isEditing ? 'User updated!' : 'User created!' });
                setTimeout(() => {
                    setShowModal(false);
                    setMessage({ type: '', text: '' });
                    fetchUsers();
                }, 1000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Action failed.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error connecting to server.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
            } else {
                alert(data.message || 'Delete failed');
            }
        } catch (err) {
            alert('Error deleting user');
        }
    };

    const exportToCSV = () => {
        const headers = ['Name,Email,Role,Status,Created By'];
        const rows = filteredUsers.map(u => `${u.name},${u.email},${u.role},${u.status || 'Active'},${u.createdBy || 'System'}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `users_report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filtering Logic
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || (u.status || 'Active') === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = [
        { label: 'Total Users', value: users.length, icon: '👥', sub: 'Active accounts' },
        { label: 'Admin', value: users.filter(u => u.role === 'Admin').length, icon: '🛡️', sub: 'Full access' },
        { label: 'Manager', value: users.filter(u => u.role === 'Manager').length, icon: '🛰️', sub: 'Limited access' },
    ];

    return (
        <div className="space-y-6 pb-20 max-w-[1600px] mx-auto px-4">

            {/* Header section */}
            <div className="text-center space-y-4 py-4 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-gray-900 tracking-tighter uppercase">
                    Manage <span className="text-[#21a0b5]">Users</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Create and manage login users</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                            <h3 className="text-4xl font-black text-gray-900">{s.value}</h3>
                            <p className="text-[10px] text-[#21a0b5] font-bold mt-1 uppercase italic">{s.sub}</p>
                        </div>
                        <div className="text-4xl p-5 bg-gray-50 rounded-lg">{s.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
                <div className="flex-1 min-w-[300px] relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text" placeholder="Find user..."
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-gray-50 text-sm font-bold border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none transition-all text-gray-900 placeholder:text-gray-300"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-[10px] font-black uppercase text-gray-400">Role:</label>
                    <select className="bg-gray-50 border-none ring-1 ring-gray-100 px-4 py-3 rounded-xl text-xs font-black text-gray-700 focus:ring-2 focus:ring-[#21a0b5] outline-none" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="All">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>

                <div className="flex gap-3 ml-auto">
                    <button onClick={exportToCSV} className="bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                        📥 CSV
                    </button>
                    <button onClick={handleOpenAddModal} className="bg-[#21a0b5] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a8396] shadow-lg shadow-[#21a0b5]/20 transition-all">
                        ➕ Add New User
                    </button>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">User</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">Role</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">Created By</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isFetching ? (
                            <tr><td colSpan="5" className="py-20 text-center text-xs text-gray-400 italic font-bold">Loading records...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" className="py-20 text-center text-xs text-gray-400 italic font-bold">No users found.</td></tr>
                        ) : filteredUsers.map((u, i) => (
                            <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#21a0b5]/10 text-[#21a0b5] flex items-center justify-center font-black text-xs">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800">{u.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${u.role === 'Admin' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${u.status === 'Inactive' ? 'bg-red-400' : 'bg-green-500 animate-pulse'}`}></div>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{u.status || 'Active'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-xs font-bold text-gray-400 italic">@{u.createdBy || 'SuperAdmin'}</td>
                                <td className="px-8 py-6">
                                    <button onClick={() => handleDeleteUser(u._id)} className="text-gray-400 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest mr-4">Delete</button>
                                    <button onClick={() => handleEditClick(u)} className="text-[#21a0b5] hover:text-gray-900 transition-colors text-xs font-black uppercase tracking-widest">Edit</button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Role Info */}
            <div className="bg-[#0a111a] p-12 rounded-xl text-white">
                <h3 className="text-2xl font-black mb-8 border-l-4 border-[#21a0b5] pl-6 tracking-tight">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4 p-8 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-2xl">🛡️</div>
                        <h4 className="text-[#21a0b5] font-black uppercase tracking-widest text-sm">Admin</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Full system access. Can manage vehicles, technicians, and all reports.</p>
                    </div>
                    <div className="space-y-4 p-8 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-2xl">🛰️</div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm">Manager</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Operations access. Can view maps, alerts, and basic reports.</p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-white/20">
                            <div className="bg-[#21a0b5] p-8 text-white text-center">
                                <h2 className="text-2xl font-black uppercase tracking-widest">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                                <p className="text-[10px] opacity-90 uppercase mt-2 font-black tracking-widest">{isEditing ? 'Update access details' : 'Register new system account'}</p>
                            </div>

                            <form onSubmit={handleSaveUser} className="p-8 space-y-6 text-gray-900">
                                {message.text && (
                                    <div className={`p-4 rounded-xl text-[10px] font-black text-center uppercase border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                        placeholder="user@fleetpulse.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isEditing ? 'New Password (Optional)' : 'Secure Password'}</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required={!isEditing}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#21a0b5] transition-colors p-2"
                                        >
                                            {showPassword ? '👁️' : '🔒'}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                {(formData.password || !isEditing) && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required={formData.password.length > 0 || !isEditing}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className={`w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 focus:ring-2 outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'ring-red-400 focus:ring-red-400' : 'ring-gray-200 focus:ring-[#21a0b5]'}`}
                                                placeholder="••••••••"
                                            />
                                            {formData.confirmPassword && (
                                                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase">
                                                    {formData.password === formData.confirmPassword ? '✅ Match' : '❌ Error'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">System Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-black text-gray-900 cursor-pointer appearance-none"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
                                    <button disabled={isLoading} className="flex-[2] bg-[#21a0b5] text-white py-4 rounded-xl font-black tracking-widest uppercase text-xs shadow-lg shadow-[#21a0b5]/20 hover:bg-[#1a8396] transition-all transform active:scale-95">
                                        {isLoading ? 'Wait...' : (isEditing ? 'Update User' : 'Register User')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersPage;
