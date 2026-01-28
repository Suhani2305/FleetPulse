import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const TechniciansPage = () => {
    const [technicians, setTechnicians] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTechId, setEditTechId] = useState(null);
    const [selectedTech, setSelectedTech] = useState(null); // For Salary History
    const [showDetailModal, setShowDetailModal] = useState(null); // For Full Detail View
    const socketRef = useRef(null);

    const [formState, setFormState] = useState({
        name: '',
        contact: '',
        email: '',
        specialty: 'GPS Installation',
        baseCity: '',
        monthlySalary: '',
        photoUrl: '',
        aadharNumber: '',
        emergencyContact: '',
        residentialAddress: '',
        dateOfJoining: new Date().toISOString().split('T')[0]
    });

    const fetchTechnicians = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/technicians`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setTechnicians(data.technicians);
        } catch (err) {
            console.error('Error fetching technicians:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians();
        socketRef.current = io(API_BASE_URL);

        socketRef.current.on('technician-update', (updatedTech) => {
            setTechnicians(prev => {
                const exists = prev.find(t => t._id === updatedTech._id);
                if (exists) {
                    return prev.map(t => t._id === updatedTech._id ? updatedTech : t);
                }
                return [updatedTech, ...prev];
            });
            setSelectedTech(prev => (prev?._id === updatedTech._id ? updatedTech : prev));
        });

        socketRef.current.on('technician-delete', (id) => {
            setTechnicians(prev => prev.filter(t => t._id !== id));
            if (selectedTech?._id === id) setSelectedTech(null);
        });

        return () => socketRef.current.disconnect();
    }, []);

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditTechId(null);
        setFormState({
            name: '', contact: '', email: '', specialty: 'GPS Installation', baseCity: '',
            monthlySalary: '', photoUrl: '', aadharNumber: '', emergencyContact: '',
            residentialAddress: '', dateOfJoining: new Date().toISOString().split('T')[0]
        });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (t) => {
        setIsEditing(true);
        setEditTechId(t._id);
        setFormState({
            name: t.name,
            contact: t.contact,
            email: t.email || '',
            specialty: t.specialty,
            baseCity: t.baseCity,
            monthlySalary: t.monthlySalary,
            photoUrl: t.photoUrl || '',
            aadharNumber: t.aadharNumber || '',
            emergencyContact: t.emergencyContact || '',
            residentialAddress: t.residentialAddress || '',
            dateOfJoining: t.dateOfJoining ? new Date(t.dateOfJoining).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setShowAddModal(true);
    };

    const handleSaveTech = async (e) => {
        e.preventDefault();
        const url = isEditing ? `${API_BASE_URL}/api/v1/technicians/${editTechId}` : `${API_BASE_URL}/api/v1/technicians`;
        const method = isEditing ? 'PUT' : 'POST';

        const payload = {
            ...formState,
            monthlySalary: Number(formState.monthlySalary),
            employeeId: isEditing ? undefined : `TCH-${Math.floor(1000 + Math.random() * 9000)}`,
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) setShowAddModal(false);
        } catch (err) {
            console.error('Operation failed');
        }
    };

    const handleUpdateSalaryRecord = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            month: formData.get('month'),
            year: Number(formData.get('year')),
            amount: Number(formData.get('amount')),
            status: formData.get('status'),
            paymentMethod: formData.get('paymentMethod'),
            paymentDate: formData.get('paymentDate') || new Date().toISOString()
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/technicians/${selectedTech._id}/salary`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                // The socket will update the UI
                e.target.reset();
            }
        } catch (err) {
            console.error('Update failed');
        }
    };

    const handleRemoveTech = async (id) => {
        if (!window.confirm('Remove this technician?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/api/v1/technicians/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Delete failed');
        }
    };

    const stats = {
        totalStaff: technicians.length,
        onField: technicians.filter(t => t.status === 'On Site').length,
        totalMonthlyPayout: technicians.reduce((acc, t) => acc + (t.monthlySalary || 0), 0)
    };

    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const YEARS = [2025, 2026, 2027];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-[#21a0b5]/10 rounded-full">
                        <span className="text-[10px] font-black text-[#21a0b5] uppercase tracking-widest">Company Service Team</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Our <span className="text-[#21a0b5]">Technicians</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage GPS installers, recharge staff, and payroll</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-[#21a0b5] transition-all flex items-center gap-2"
                >
                    ➕ Onboard Technician
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-2xl">👷</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Staff</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.totalStaff} Members</p>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-2xl">📍</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">On Road/Site</p>
                        <p className="text-3xl font-black text-emerald-500 tracking-tighter">{stats.onField} Live</p>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a111a] p-8 rounded-[2.5rem] text-white flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-2xl">💰</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">Monthly Payroll</p>
                        <p className="text-3xl font-black text-[#21a0b5] tracking-tighter">₹{stats.totalMonthlyPayout.toLocaleString()}</p>
                    </div>
                </motion.div>
            </div>

            {/* Technician Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-gray-300 font-black uppercase tracking-widest text-xs">Accessing Team Database...</div>
                ) : technicians.map((t, i) => (
                    <motion.div
                        key={t._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-start mb-8">
                            {t.photoUrl ? (
                                <img src={t.photoUrl} alt={t.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#21a0b5]/20" />
                            ) : (
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-[#21a0b5]/10 transition-all">
                                    {t.specialty === 'GPS Installation' ? '🔌' : t.specialty === 'Recharge' ? '💳' : t.specialty === 'Hardware Repair' ? '🛠️' : '🧠'}
                                </div>
                            )}
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${t.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {t.status}
                                </span>
                                <button onClick={() => handleOpenEditModal(t)} className="text-[10px] font-black uppercase text-[#21a0b5] hover:underline tracking-widest flex items-center gap-1">
                                    ⚙️ Edit Details
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3
                                onClick={() => setShowDetailModal(t)}
                                className="text-xl font-black text-gray-900 tracking-tight uppercase cursor-pointer hover:text-[#21a0b5] transition-colors"
                            >
                                {t.name}
                            </h3>
                            <p className="text-[10px] text-[#21a0b5] font-black uppercase tracking-widest">{t.specialty} Expert</p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-400 uppercase">Contact</span>
                                <span className="text-xs font-bold text-gray-700">{t.contact}</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                                <div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase">Monthly Salary</span>
                                    <p className="text-lg font-black text-gray-900">₹{t.monthlySalary?.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black text-gray-400 uppercase">Staff ID</span>
                                    <p className="text-[10px] font-black uppercase text-[#21a0b5]">{t.employeeId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex gap-3">
                            <button
                                onClick={() => setSelectedTech(t)}
                                className="flex-1 py-4 rounded-2xl bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#21a0b5] transition-all shadow-lg shadow-gray-200"
                            >
                                Salary History
                            </button>
                            <button
                                onClick={() => handleRemoveTech(t._id)}
                                className="px-6 py-4 rounded-2xl border border-gray-400 text-gray-800 hover:text-red-500 hover:border-red-100 transition-all text-[9px] font-black uppercase tracking-widest"
                            >
                                Remove
                            </button>
                        </div>

                        {t.lastSalaryDate && (
                            <p className="mt-4 text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center">
                                Last Payment: {new Date(t.lastSalaryDate).toLocaleDateString()}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Technician Full Detail Modal */}
            <AnimatePresence>
                {showDetailModal && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(null)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, rotateX: 20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} exit={{ scale: 0.9, opacity: 0, rotateX: 20 }} className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row">

                            {/* Left Side: Visual Profile */}
                            <div className="w-full md:w-[40%] bg-[#0a111a] p-12 text-white flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#21a0b5]/20 blur-[80px] rounded-full -mr-32 -mt-32"></div>

                                <div className="relative z-10 mb-8">
                                    {showDetailModal.photoUrl ? (
                                        <img src={showDetailModal.photoUrl} alt="" className="w-48 h-48 rounded-[3rem] object-cover border-4 border-[#21a0b5]" />
                                    ) : (
                                        <div className="w-48 h-48 rounded-[3rem] bg-white/5 flex items-center justify-center text-7xl border-4 border-white/10">
                                            {showDetailModal.specialty === 'GPS Installation' ? '🔌' : '🛠️'}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#21a0b5] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl">
                                        ✓
                                    </div>
                                </div>

                                <h4 className="text-3xl font-black uppercase tracking-tight text-center leading-none mb-2">{showDetailModal.name}</h4>
                                <p className="text-[10px] font-black text-[#21a0b5] uppercase tracking-[0.3em] mb-8">{showDetailModal.employeeId}</p>

                                <div className="w-full space-y-4 pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <span>Status</span>
                                        <span className="text-emerald-400">Verified Active</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <span>Expertise</span>
                                        <span className="text-white">{showDetailModal.specialty}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Data Grid */}
                            <div className="flex-1 p-16 overflow-y-auto custom-scrollbar bg-white">
                                <header className="mb-12 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-4xl font-black text-gray-900 leading-none">OFFICIAL <span className="text-[#21a0b5]">RECORD</span></h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-1">Personnel Information File (PIF)</p>
                                    </div>
                                    <button onClick={() => setShowDetailModal(null)} className="text-gray-300 hover:text-gray-900 font-black text-xl">✕</button>
                                </header>

                                <div className="space-y-12">
                                    <section>
                                        <h5 className="text-[10px] font-black text-[#21a0b5] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#21a0b5] rounded-full"></span> IDENTIFICATION
                                        </h5>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Aadhar Number</p>
                                                <p className="text-sm font-black text-gray-900 tracking-widest">{showDetailModal.aadharNumber || 'NOT RECORDED'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Access</p>
                                                <p className="text-sm font-black text-gray-900 lowercase">{showDetailModal.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h5 className="text-[10px] font-black text-[#21a0b5] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#21a0b5] rounded-full"></span> CONTACT & LOCATION
                                        </h5>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Primary Phone</p>
                                                    <p className="text-sm font-black text-gray-900">{showDetailModal.contact}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Base City</p>
                                                    <p className="text-sm font-black text-gray-900">{showDetailModal.baseCity}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Residential Address</p>
                                                <p className="text-sm font-bold text-gray-600 leading-relaxed">{showDetailModal.residentialAddress || 'Official address not updated in system.'}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h5 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> EMERGENCY PROTOCOL
                                        </h5>
                                        <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                                            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Immediate Authorized Contact</p>
                                            <p className="text-sm font-black text-red-700">{showDetailModal.emergencyContact || 'EMERGENCY RECORD MISSING'}</p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Salary History / Excel Sheet Modal */}
            <AnimatePresence>
                {selectedTech && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTech(null)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl relative z-10 flex flex-col">

                            <header className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Salary <span className="text-[#21a0b5]">History</span></h3>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{selectedTech.name} • {selectedTech.employeeId}</p>
                                </div>
                                <button onClick={() => setSelectedTech(null)} className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">✕</button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                {/* Add/Update Form (Excel style row) */}
                                <div className="mb-10 bg-[#21a0b5]/5 p-8 rounded-[2rem] border border-[#21a0b5]/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#21a0b5] mb-6">Log New Monthly Payment</h4>
                                    <form onSubmit={handleUpdateSalaryRecord} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Month</label>
                                            <select name="month" className="w-full px-4 py-3 bg-white rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold text-gray-700">
                                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Year</label>
                                            <select name="year" className="w-full px-4 py-3 bg-white rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold text-gray-700">
                                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Amount</label>
                                            <input name="amount" type="number" defaultValue={selectedTech.monthlySalary} className="w-full px-4 py-3 bg-white rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold text-gray-700" />
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Method</label>
                                            <select name="paymentMethod" className="w-full px-4 py-3 bg-white rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold text-gray-700">
                                                <option value="UPI">UPI</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Bank">Bank Transfer</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Status</label>
                                            <select name="status" className="w-full px-4 py-3 bg-white rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold text-gray-700">
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="bg-[#21a0b5] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">Save Row</button>
                                    </form>
                                </div>

                                {/* Excel-like Table */}
                                <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/80">
                                            <tr>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Month / Year</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Salary Amount</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Method</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">System Status</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectedTech.salaryHistory?.length > 0 ? [...selectedTech.salaryHistory].sort((a, b) => b.year - a.year || MONTHS.indexOf(b.month) - MONTHS.indexOf(a.month)).map((record, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <span className="text-sm font-black text-gray-900">{record.month}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 ml-2">{record.year}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-sm font-black text-gray-900">₹{record.amount?.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${record.paymentMethod === 'UPI' ? 'bg-purple-50 text-purple-600' : record.paymentMethod === 'Cash' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {record.paymentMethod}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${record.status === 'Paid' ? 'bg-emerald-500' : 'bg-red-400 animate-pulse'}`}></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${record.status === 'Paid' ? 'text-emerald-600' : 'text-red-400'}`}>{record.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs italic">No payment history found for this member</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Onboard / Edit Technician Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col">
                            <header className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{isEditing ? 'Update' : 'Official'} <span className="text-[#21a0b5]">Onboarding</span></h3>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 text-left">Internal Company Staff Database</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">✕</button>
                            </header>

                            <form onSubmit={handleSaveTech} className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-[#21a0b5] rounded-full"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Basic Information</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Full Legal Name</label>
                                            <input value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} required className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Contact Number</label>
                                            <input value={formState.contact} onChange={e => setFormState({ ...formState, contact: e.target.value })} required className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Aadhar Number</label>
                                            <input value={formState.aadharNumber} onChange={e => setFormState({ ...formState, aadharNumber: e.target.value })} required placeholder="XXXX XXXX XXXX" className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Photo URL</label>
                                            <input value={formState.photoUrl} onChange={e => setFormState({ ...formState, photoUrl: e.target.value })} placeholder="https://..." className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Details */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-[#21a0b5] rounded-full"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Official Details</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Role Specialty</label>
                                            <select value={formState.specialty} onChange={e => setFormState({ ...formState, specialty: e.target.value })} className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-black text-[10px] uppercase tracking-widest text-[#21a0b5]">
                                                <option value="GPS Installation">GPS Installation</option>
                                                <option value="Recharge">Recharge Expert</option>
                                                <option value="Hardware Repair">Hardware Repair</option>
                                                <option value="IoT Diagnostics">IoT Diagnostics</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Monthly Salary (Fixed)</label>
                                            <input type="number" value={formState.monthlySalary} onChange={e => setFormState({ ...formState, monthlySalary: e.target.value })} required className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-black text-lg text-emerald-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Base City</label>
                                            <input value={formState.baseCity} onChange={e => setFormState({ ...formState, baseCity: e.target.value })} required className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Date of Joining</label>
                                            <input type="date" value={formState.dateOfJoining} onChange={e => setFormState({ ...formState, dateOfJoining: e.target.value })} required className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency & Address */}
                                <div className="space-y-6 pb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-red-400 rounded-full"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Emergency & Residence</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Residential Address</label>
                                            <textarea value={formState.residentialAddress} onChange={e => setFormState({ ...formState, residentialAddress: e.target.value })} required rows="3" className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900 resize-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Emergency Contact (Name/Phone)</label>
                                            <input value={formState.emergencyContact} onChange={e => setFormState({ ...formState, emergencyContact: e.target.value })} required className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900" />
                                        </div>
                                    </div>
                                </div>

                                <div className="sticky bottom-0 bg-white pt-6 flex gap-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 border border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                                    <button type="submit" className="flex-[2] py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#21a0b5] transition-all">
                                        {isEditing ? 'Save Changes' : 'Confirm Onboarding'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Coverage Info (Premium Footer) */}
            <div className="bg-[#0a111a] p-16 rounded-[4rem] text-white flex flex-col lg:flex-row gap-16 items-center overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#21a0b5]/10 blur-[150px] rounded-full -mr-64 -mt-64 transition-all group-hover:bg-[#21a0b5]/20"></div>
                <div className="flex-1 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#21a0b5]/20 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 bg-[#21a0b5] rounded-full animate-ping"></span>
                        <span className="text-[9px] font-black text-[#21a0b5] uppercase tracking-widest">Live Deployment Hub</span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-6 leading-tight">National <span className="text-[#21a0b5]">Service Grid</span></h3>
                    <p className="text-sm font-bold text-gray-500 mb-10 leading-relaxed max-w-md">Our in-house engineers are deployed across 24 regional hubs, providing 24/7 on-ground assistance for high-priority GPS installations and specialized IoT diagnostics.</p>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-5xl font-black text-white tracking-tighter">98.2%</p>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Uptime Reliability</p>
                        </div>
                        <div>
                            <p className="text-5xl font-black text-[#21a0b5] tracking-tighter">~12m</p>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Avg Dispatch Rate</p>
                        </div>
                    </div>
                </div>

                {/* Visual Heatmap Grid with Radar Search Effect */}
                <div className="flex-1 w-full lg:h-[400px] bg-white/[0.02] rounded-[3.5rem] border border-white/4 relative overflow-hidden flex items-center justify-center">
                    {/* Radar Sweep Effect */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-[#21a0b5]/20 via-transparent to-transparent origin-center rounded-full"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />

                    {/* Grid Nodes */}
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-6 p-12 opacity-30">
                        {Array.from({ length: 96 }).map((_, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: Math.random() > 0.9 ? [1, 1.5, 1] : 1,
                                    backgroundColor: Math.random() > 0.9 ? ['rgba(33, 160, 181, 0.2)', 'rgba(33, 160, 181, 1)', 'rgba(33, 160, 181, 0.2)'] : 'rgba(255, 255, 255, 0.05)'
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 5 }}
                                className="w-1.5 h-1.5 rounded-full"
                            />
                        ))}
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-full border border-[#21a0b5]/30 animate-ping absolute -inset-0"></div>
                            <div className="w-24 h-24 rounded-full bg-gray-900 border border-[#21a0b5]/50 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(33,160,181,0.3)]">
                                📡
                            </div>
                        </div>
                        <span className="text-white font-black italic uppercase tracking-[0.5em] text-xs block mb-2">Heatmap Active</span>
                        <div className="flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-[#21a0b5] rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-bold text-[#21a0b5] uppercase tracking-widest">Scanning Regional Nodes...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechniciansPage;
