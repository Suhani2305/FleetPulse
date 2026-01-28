import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const TransportersPage = () => {
    const [transporters, setTransporters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState(null); // Settings Modal
    const [showAddModal, setShowAddModal] = useState(false); // Add Vendor Modal
    const socketRef = useRef(null);

    useEffect(() => {
        fetchTransporters();

        socketRef.current = io(API_BASE_URL);

        socketRef.current.on('transporter-update', (updatedVendor) => {
            setTransporters(prev => {
                const exists = prev.find(v => v._id === updatedVendor._id);
                if (exists) {
                    return prev.map(v => v._id === updatedVendor._id ? updatedVendor : v);
                }
                return [updatedVendor, ...prev];
            });

            // Update modal if it's open for this vendor
            setSelectedVendor(prev => (prev?._id === updatedVendor._id ? updatedVendor : prev));
        });

        return () => socketRef.current.disconnect();
    }, []);

    const fetchTransporters = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/transporters`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setTransporters(data.transporters);
        } catch (err) {
            console.error('Error fetching vendors:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateVendor = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newVendor = {
            name: formData.get('name'),
            contactPerson: formData.get('contactPerson'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            baseHub: formData.get('baseHub'),
            fleetSize: Number(formData.get('fleetSize') || 0)
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/transporters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newVendor)
            });
            const data = await response.json();
            if (data.success) {
                setShowAddModal(false);
                // No need to manually add to state, socket will handle it
            }
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    const handleUpdatePayout = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updateData = {
            amountPayable: Number(formData.get('amountPayable')),
            amountPaid: Number(formData.get('amountPaid')),
            status: formData.get('status')
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/transporters/${selectedVendor._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });
            const data = await response.json();
            if (data.success) {
                setSelectedVendor(null);
            }
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const stats = {
        totalPayable: transporters.reduce((acc, t) => acc + (t.amountPayable || 0), 0),
        activeVendors: transporters.filter(t => t.status === 'Active').length,
        avgReliability: '96%'
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Vendor List</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Our <span className="text-amber-500">Transporters</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage third-party vehicle partners and billing</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-amber-500 transition-all flex items-center gap-2"
                >
                    ➕ Register New Vendor
                </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-xl">💸</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payable</p>
                        <p className="text-3xl font-black text-red-500 tracking-tighter">₹{stats.totalPayable.toLocaleString()}</p>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-2xl">✅</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Partners</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.activeVendors} Teams</p>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 p-8 rounded-[2.5rem] text-white flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-2xl">🚛</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">Average Reliability</p>
                        <p className="text-3xl font-black text-[#21a0b5] tracking-tighter">{stats.avgReliability}</p>
                    </div>
                </motion.div>
            </div>

            {/* Transporters List */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active <span className="text-amber-500">Vendors</span></h4>
                        <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">Real-time performance and billing status</p>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Search Vendor Name..." className="px-6 py-3 bg-white rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-[10px] font-bold w-64 shadow-sm" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 text-center animate-pulse text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Loading Network...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Company Detail</th>
                                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Base Hub</th>
                                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Truck Count</th>
                                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Unpaid Amount</th>
                                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transporters.map((t, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={t._id || i}
                                        className="hover:bg-gray-50/80 transition-all group cursor-pointer"
                                        onClick={() => setSelectedVendor(t)}
                                    >
                                        <td className="px-10 py-8">
                                            <p className="text-lg font-black text-gray-900 tracking-tight leading-none mb-2">{t.name}</p>
                                            <div className="flex items-center gap-1.5">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} className={`text-[8px] ${star <= Math.floor(t.rating || 5) ? 'text-amber-400' : 'text-gray-100'}`}>⭐</span>
                                                ))}
                                                <span className="text-[9px] font-black text-gray-300 uppercase ml-2">{t.rating || 5.0} Score</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">{t.baseHub || 'National'}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-2xl font-black text-gray-800 tracking-tighter leading-none mb-1">{t.fleetSize || 0}</p>
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Active Trucks</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col items-center">
                                                <p className="text-lg font-black text-red-500 tracking-tight">₹{(t.amountPayable || 0).toLocaleString()}</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">Payable</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                    {t.status || 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {transporters.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest">No Vendors Registered</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Vendor Details (Payout) Modal */}
            <AnimatePresence>
                {selectedVendor && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVendor(null)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative z-10 max-h-[90vh] flex flex-col overflow-y-auto custom-scrollbar">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">Manage <span className="text-amber-500">Billing</span></h3>
                            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-6">Update records for {selectedVendor.name}</p>

                            <form onSubmit={handleUpdatePayout} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Total Amount Payable</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-red-400">₹</span>
                                        <input name="amountPayable" type="number" defaultValue={selectedVendor.amountPayable} className="w-full pl-9 pr-4 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-red-200 outline-none font-black text-lg text-red-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Total Amount Paid</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-400">₹</span>
                                        <input name="amountPaid" type="number" defaultValue={selectedVendor.amountPaid} className="w-full pl-9 pr-4 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-emerald-200 outline-none font-black text-lg text-emerald-600" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Vendor Status</label>
                                    <select name="status" defaultValue={selectedVendor.status} className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none font-black text-[9px] uppercase tracking-widest text-[#21a0b5]">
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setSelectedVendor(null)} className="flex-1 py-4 border border-gray-100 text-gray-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-gray-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-amber-500 transition-all">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add New Vendor Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh] custom-scrollbar">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">Register <span className="text-amber-500">New Vendor</span></h3>
                            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-6">Onboard a third-party transporter to your network</p>

                            <form onSubmit={handleCreateVendor} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Company Name</label>
                                        <input name="name" required placeholder="e.g. North East Logistics" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm text-gray-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Contact Person</label>
                                        <input name="contactPerson" required placeholder="Full Name" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm text-gray-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Email Address</label>
                                        <input name="email" type="email" required placeholder="vendor@example.com" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm text-gray-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Phone Number</label>
                                        <input name="phone" required placeholder="+91 00000 00000" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm text-gray-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Base Hub (City)</label>
                                        <input name="baseHub" required placeholder="e.g. Ludhiana" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm text-gray-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Fleet Size</label>
                                        <input name="fleetSize" type="number" placeholder="0" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm text-gray-900" />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border border-gray-100 text-gray-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-gray-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-amber-500 transition-all">Onboard Vendor</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Insight Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0a111a] p-12 rounded-[4rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Vendor <span className="text-amber-500">Integrations</span></h4>
                        <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed max-w-sm">Connect third-party GPS providers directly to your dashboard for real-time tracking across all vendors.</p>
                        <div className="flex gap-4">
                            <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-amber-500">92% Connected</div>
                            <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-emerald-400">8 API Secure</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-12 rounded-[4rem] text-white flex flex-col justify-center shadow-2xl shadow-amber-500/20">
                    <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">Onboard New Hub</h4>
                    <p className="text-sm font-bold opacity-90 mb-8 max-w-sm">Expanding capacity? Add new transport vendors into your logistics ecosystem in minutes.</p>
                    <button className="w-fit bg-white text-amber-600 px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Start Registration</button>
                </div>
            </div>
        </div>
    );
};

export default TransportersPage;
