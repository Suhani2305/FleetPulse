import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [billing, setBilling] = useState({ totalDue: 0, totalPaid: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [terminalModal, setTerminalModal] = useState(null); // { client: obj, vehicles: [], activeTab: 'fleet' | 'ledger' | 'report' }
    const [terminalLoading, setTerminalLoading] = useState(false);
    const socketRef = useRef(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [clientsRes, billingRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/v1/clients`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/v1/clients/billing/overview`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const clientsData = await clientsRes.json();
            const billingData = await billingRes.json();

            if (clientsData.success) setClients(clientsData.clients);
            if (billingData.success) setBilling(billingData.billing);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        socketRef.current = io(API_BASE_URL);

        socketRef.current.on('vehicle-update', (updatedVehicle) => {
            setClients(prevClients => prevClients.map(client => {
                if (client._id === updatedVehicle.clientId) {
                    return { ...client, activeVehicles: updatedVehicle.status === 'Moving' ? (client.activeVehicles || 0) + 1 : Math.max(0, (client.activeVehicles || 0) - 1) };
                }
                return client;
            }));
        });

        socketRef.current.on('client-update', (updatedClient) => {
            setClients(prev => prev.map(c => c._id === updatedClient._id ? { ...c, ...updatedClient } : c));
            setTerminalModal(prev => (prev && prev.client._id === updatedClient._id) ? { ...prev, client: updatedClient } : prev);
        });

        socketRef.current.on('billing-update', (updatedBilling) => {
            setBilling(updatedBilling);
        });

        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, []);

    const openTerminal = async (client) => {
        setTerminalLoading(true);
        setTerminalModal({ client, vehicles: [], activeTab: 'fleet' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/clients/${client._id}/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setTerminalModal(prev => ({ ...prev, vehicles: data.vehicles }));
            }
        } catch (err) {
            console.error('Fetch failed');
        } finally {
            setTerminalLoading(false);
        }
    };

    const handleLedgerUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/clients/${terminalModal.client._id}/billing`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                // Success
            }
        } catch (err) {
            console.error('Update failed');
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-[#21a0b5]/10 rounded-full">
                        <span className="text-[10px] font-black text-[#21a0b5] uppercase tracking-widest">Enterprise Network</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Our <span className="text-[#21a0b5]">Clients</span>
                    </motion.h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] md:text-[10px]">
                        Manage your business partners and their vehicle fleets
                    </p>
                    <div className="w-12 md:w-16 h-1 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-3"></div>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gray-900 text-white px-9 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-[#21a0b5] transition-all flex items-center gap-2 active:scale-95"
                >
                    ➕ Register New Client
                </button>
            </div>

            {/* Client Cards Grid */}
            {isLoading ? (
                <div className="py-20 text-center animate-pulse text-gray-300 font-black uppercase tracking-widest text-xs">Loading Clients...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {clients.map((c, i) => (
                        <motion.div
                            key={c._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-5xl group-hover:bg-[#21a0b5]/10 transition-all opacity-10 group-hover:opacity-30">🏢</div>

                            <div className="relative z-10">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4 ${c.status === 'Enterprise' ? 'bg-purple-50 text-purple-600' :
                                    c.status === 'Premium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>{c.status} Type</span>

                                <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight uppercase">{c.name}</h3>
                                <p className="text-[11px] text-gray-400 font-bold uppercase mb-8 tracking-wide flex items-center gap-2">
                                    👤 {c.contactPerson}
                                </p>

                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Fleet</p>
                                        <p className="text-2xl font-black text-gray-900 tracking-tight">{c.totalVehicles || 0} <span className="text-[10px] text-gray-400">Trucks</span></p>
                                    </div>
                                    <div className="border-l border-gray-200 pl-6">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Live Now</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <p className="text-2xl font-black text-emerald-500 tracking-tight">{c.activeVehicles || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => openTerminal(c)}
                                    className="w-full py-5 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#21a0b5] transition-all shadow-lg active:scale-95"
                                >
                                    Manage Client & Billing
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Total Billing Overview (Owners View) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a111a] p-10 md:p-14 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#21a0b5] opacity-5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Business <span className="text-[#21a0b5]">Billing Summary</span></h3>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Outstanding vs Total Received across all clients</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 md:gap-16 relative z-10 w-full md:w-auto">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Total Outstanding (Balance)</p>
                        <p className="text-4xl font-black text-red-400 tracking-tight">₹{(billing.totalDue || 0).toLocaleString()}</p>
                    </div>
                    <div className="w-full h-[1px] md:w-[1px] md:h-12 bg-gray-800 self-center hidden sm:block"></div>
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Total Received (Collected)</p>
                        <p className="text-4xl font-black text-emerald-400 tracking-tight">₹{(billing.totalPaid || 0).toLocaleString()}</p>
                    </div>
                </div>
            </motion.div>

            {/* Unified Modal (Fleet + Billing + Report) */}
            <AnimatePresence>
                {terminalModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTerminalModal(null)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col">

                            {/* Modal Header */}
                            <header className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{terminalModal.client.name} <span className="text-[#21a0b5]">Overview</span></h3>
                                    <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">{terminalModal.client.contactPerson} • {terminalModal.client.email}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setTerminalModal(prev => ({ ...prev, activeTab: 'fleet' }))}
                                        className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${terminalModal.activeTab === 'fleet' ? 'bg-white shadow-sm text-[#21a0b5]' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        🚛 Trucks
                                    </button>
                                    <button
                                        onClick={() => setTerminalModal(prev => ({ ...prev, activeTab: 'ledger' }))}
                                        className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${terminalModal.activeTab === 'ledger' ? 'bg-white shadow-sm text-[#21a0b5]' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        🖋️ Billing
                                    </button>
                                    <button
                                        onClick={() => setTerminalModal(prev => ({ ...prev, activeTab: 'report' }))}
                                        className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${terminalModal.activeTab === 'report' ? 'bg-white shadow-sm text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        📑 Statement
                                    </button>
                                    <button onClick={() => setTerminalModal(null)} className="w-9 h-9 rounded-lg bg-gray-900 text-white flex items-center justify-center text-base ml-1">✕</button>
                                </div>
                            </header>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/30">
                                {terminalModal.activeTab === 'fleet' ? (
                                    <div className="space-y-6">
                                        {terminalLoading ? (
                                            <div className="py-20 text-center animate-pulse text-gray-300 font-bold uppercase tracking-widest">Loading Fleet...</div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {terminalModal.vehicles.map((v) => (
                                                    <div key={v._id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">IMEI: {v.deviceId}</span>
                                                            <div className={`w-2 h-2 rounded-full ${v.status === 'Moving' ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></div>
                                                        </div>
                                                        <p className="text-xl font-black text-gray-900 leading-none mb-1">{v.plateNumber}</p>
                                                        <p className="text-[10px] font-bold text-[#21a0b5] uppercase tracking-wide mb-4">{v.model}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-[#21a0b5]" style={{ width: `${v.fuelLevel}%` }}></div>
                                                            </div>
                                                            <span className="text-[9px] font-black text-gray-400">⛽ {v.fuelLevel}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {terminalModal.vehicles.length === 0 && (
                                                    <div className="col-span-full py-20 text-center text-gray-300 font-bold uppercase tracking-widest border-2 border-dashed border-gray-100 rounded-3xl">No Trucks Assigned</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : terminalModal.activeTab === 'ledger' ? (
                                    <div className="max-w-xl mx-auto">
                                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                            <h4 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tight text-center">Manage <span className="text-[#21a0b5]">Billing</span></h4>
                                            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-6 text-center">Update outstanding dues and payments here</p>

                                            <form onSubmit={handleLedgerUpdate} className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Monthly Rate / Truck</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                                            <input name="monthlySubscriptionFee" type="number" defaultValue={terminalModal.client.monthlySubscriptionFee || 5000} className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Client Series</label>
                                                        <select name="status" defaultValue={terminalModal.client.status} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-black text-[10px] uppercase tracking-widest text-[#21a0b5]">
                                                            <option value="Enterprise">Enterprise</option>
                                                            <option value="Premium">Premium</option>
                                                            <option value="Growth">Growth</option>
                                                            <option value="Standard">Standard</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Total Balance Due</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-red-400">₹</span>
                                                        <input name="billingDue" type="number" defaultValue={terminalModal.client.billingDue} className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-red-200 outline-none font-black text-lg text-red-500" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Total Amount Received</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-400">₹</span>
                                                        <input name="billingPaid" type="number" defaultValue={terminalModal.client.billingPaid} className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-emerald-200 outline-none font-black text-lg text-emerald-600" />
                                                    </div>
                                                </div>

                                                <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#21a0b5] transition-all">Save Changes</button>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    /* Monthly Sheet (Statement) Tab */
                                    <div className="max-w-3xl mx-auto space-y-8 py-6">
                                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start mb-10">
                                                <div>
                                                    <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Monthly <span className="text-[#21a0b5]">Statement</span></h4>
                                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Period: January 2026</p>
                                                </div>
                                                <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#21a0b5] transition-all">Download PDF</button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-6">
                                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Subscription Breakdown</p>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-gray-500">Total Units</span>
                                                                <span className="text-xs font-black text-gray-900">{terminalModal.client.totalVehicles}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-gray-500">Unit Price</span>
                                                                <span className="text-xs font-black text-gray-900">₹{terminalModal.client.monthlySubscriptionFee?.toLocaleString()}</span>
                                                            </div>
                                                            <div className="h-[1px] bg-gray-200 my-2"></div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-black text-[#21a0b5] uppercase">Subtotal</span>
                                                                <span className="text-lg font-black text-[#21a0b5]">₹{(terminalModal.client.totalVehicles * (terminalModal.client.monthlySubscriptionFee || 0)).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                                        <p className="text-[10px] font-black text-emerald-600 uppercase mb-4 tracking-widest">Payment Summary</p>
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <span className="text-[9px] font-black text-emerald-400 uppercase">Total Collected</span>
                                                                <p className="text-3xl font-black text-emerald-600">₹{(terminalModal.client.billingPaid || 0).toLocaleString()}</p>
                                                            </div>
                                                            <span className="text-[2rem] opacity-20">💰</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                                                        <p className="text-[10px] font-black text-red-600 uppercase mb-4 tracking-widest">Balance Outstanding</p>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <span className="text-[9px] font-black text-red-400 uppercase">Previous Balance</span>
                                                                <p className="text-2xl font-black text-red-600">₹{((terminalModal.client.billingDue || 0) - (terminalModal.client.totalVehicles * (terminalModal.client.monthlySubscriptionFee || 0))).toLocaleString()}</p>
                                                            </div>
                                                            <div className="h-[1px] bg-red-100"></div>
                                                            <div>
                                                                <span className="text-[9px] font-black text-red-400 uppercase underline decoration-2 underline-offset-4">Net Pending Amount</span>
                                                                <p className="text-4xl font-black text-red-600 mt-1">₹{(terminalModal.client.billingDue || 0).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Add New Client Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col">
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <h3 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tight text-center">Add New <span className="text-[#21a0b5]">Client</span></h3>
                                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest text-center mb-6">Register a company for GPS tracking access</p>

                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const payload = Object.fromEntries(formData);
                                    try {
                                        const token = localStorage.getItem('token');
                                        const res = await fetch(`${API_BASE_URL}/api/v1/clients`, {
                                            method: 'POST',
                                            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload)
                                        });
                                        const data = await res.json();
                                        if (data.success) { fetchData(); setShowAddModal(false); }
                                    } catch (err) { console.error('Error'); }
                                }} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Company Name</label>
                                            <input name="name" required className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Contact Person</label>
                                            <input name="contactPerson" required className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Official Email</label>
                                        <input name="email" type="email" required className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Mobile Number</label>
                                            <input name="phone" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Account Type</label>
                                            <select name="status" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-black text-[9px] uppercase tracking-widest text-[#21a0b5]">
                                                <option value="Premium">Premium</option>
                                                <option value="Enterprise">Enterprise</option>
                                                <option value="Growth">Growth</option>
                                                <option value="Standard">Standard</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-gray-500">Cancel</button>
                                        <button type="submit" className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-[#21a0b5] transition-all">Create Client</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientsPage;
