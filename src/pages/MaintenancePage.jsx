import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const MaintenancePage = () => {
    const [schedule, setSchedule] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [activeTab, setActiveTab] = useState('Active Schedule');
    const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
    const [formState, setFormState] = useState({
        vehicle: '',
        service: '',
        dueDate: '',
        mileage: '',
        priority: 'Medium',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
        fetchVehicles();
    }, []);

    const fetchSchedule = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/maintenance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSchedule(data.schedule);
            }
        } catch (err) {
            console.error('Error fetching maintenance schedule:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setVehicles(data.vehicles);
            }
        } catch (err) {
            console.error('Error fetching vehicles:', err);
        }
    };

    const handleCreateWorkOrder = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/maintenance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formState)
            });
            const data = await res.json();
            if (data.success) {
                setSchedule(prev => [...prev, data.task]);
                setShowWorkOrderModal(false);
                setFormState({ vehicle: '', service: '', dueDate: '', mileage: '', priority: 'Medium', notes: '' });
            }
        } catch (err) {
            console.error('Error creating work order:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/maintenance/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSchedule(prev => prev.filter(s => s._id !== id));
            }
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const stats = {
        overdue: schedule.filter(s => s.status === 'Overdue').length,
        upcoming: schedule.filter(s => s.status === 'Upcoming').length,
        completed: schedule.filter(s => s.status === 'Completed').length
    };

    // Group vehicles by Transporter
    const groupedVehicles = vehicles.reduce((acc, v) => {
        const vendor = v.transporterId?.name || 'In-House / Other';
        if (!acc[vendor]) acc[vendor] = [];
        acc[vendor].push(v);
        return acc;
    }, {});

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Asset <span className="text-[#21a0b5]">Care</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Fleet Health & Preventive Maintenance Protocol</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-lg">⚠️</div>
                        <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Attention Required</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{stats.overdue} Tasks</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowWorkOrderModal(true)}
                        className="bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-[#21a0b5] transition-all flex items-center gap-2"
                    >
                        ➕ Create Work Order
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100 shadow-inner">
                <div className="flex gap-1.5">
                    {['Active Schedule', 'Workshop History', 'Inventory Status'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-lg shadow-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="pr-6">
                    <span className="text-[10px] font-black text-[#21a0b5] uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#21a0b5] rounded-full animate-pulse"></span> System Sync Active
                    </span>
                </div>
            </div>

            {/* Maintenance Logic View */}
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <div className="py-20 text-center animate-pulse text-gray-300 font-black uppercase tracking-widest text-xs italic">Consulting Maintenance Logs...</div>
                ) : schedule.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {schedule.map((task, i) => (
                            <motion.div
                                key={task._id}
                                layout
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all border-l-[8px]"
                                style={{ borderLeftColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981' }}
                            >
                                <div className="flex items-center gap-6 md:gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-[#21a0b5]/10 group-hover:rotate-12 transition-all duration-500">
                                        {task.service.includes('Oil') ? '🛢️' : task.service.includes('Brake') || task.service.includes('Break') ? '🛑' : task.service.includes('Tyre') ? '🛞' : '🔧'}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">{task.service}</h4>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-[#21a0b5] bg-[#21a0b5]/10 px-3 py-1 rounded-lg uppercase tracking-widest">{task.vehicle}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• Threshold: {task.mileage}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 md:gap-12">
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Due Deadline</p>
                                        <p className="text-base font-black text-gray-900 uppercase tracking-tight">{new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div className="w-28 text-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Priority</p>
                                        <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black tracking-[0.15em] uppercase border ${task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100 shadow-lg shadow-red-500/10' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                            {task.priority === 'High' ? '🔥 High' : task.priority}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg hover:bg-[#21a0b5] transition-all shadow-lg active:scale-95">→</button>
                                        <button onClick={() => handleDeleteSchedule(task._id)} className="w-12 h-12 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center text-lg hover:bg-red-50 hover:text-red-500 transition-all active:scale-95">🗑️</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="py-32 text-center">
                        <div className="text-6xl mb-6 opacity-20">🛋️</div>
                        <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Maintenance Tasks Found for current fleet</p>
                    </div>
                )}
            </div>

            {/* Create Work Order Modal */}
            <AnimatePresence>
                {showWorkOrderModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWorkOrderModal(false)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 max-h-[95vh] flex flex-col">
                            <header className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">New <span className="text-[#21a0b5]">Work Order</span></h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Official Maintenance Authorization</p>
                                </div>
                                <button onClick={() => setShowWorkOrderModal(false)} className="w-12 h-12 bg-gray-900 rounded-2xl text-white flex items-center justify-center text-xl font-black hover:bg-[#21a0b5] transition-all">✕</button>
                            </header>

                            <form onSubmit={handleCreateWorkOrder} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Select Vehicle (Grouped by Vendor)</label>
                                        <select
                                            value={formState.vehicle}
                                            onChange={e => setFormState({ ...formState, vehicle: e.target.value })}
                                            required
                                            className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-[#21a0b5] transition-all"
                                        >
                                            <option value="">-- Choose Truck --</option>
                                            {Object.entries(groupedVehicles).map(([vendor, list]) => (
                                                <optgroup key={vendor} label={vendor}>
                                                    {list.map(v => (
                                                        <option key={v._id} value={v.plateNumber}>{v.plateNumber} ({v.model} - {v.status})</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Service Type</label>
                                        <input value={formState.service} onChange={e => setFormState({ ...formState, service: e.target.value })} required placeholder="e.g. Oil Change" className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-[#21a0b5] transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Deadline</label>
                                        <input type="date" value={formState.dueDate} onChange={e => setFormState({ ...formState, dueDate: e.target.value })} required className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-[#21a0b5] transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Target Mileage</label>
                                        <input value={formState.mileage} onChange={e => setFormState({ ...formState, mileage: e.target.value })} required placeholder="e.g. 50,000 km" className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-[#21a0b5] transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Priority</label>
                                        <select value={formState.priority} onChange={e => setFormState({ ...formState, priority: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none outline-none font-black text-[10px] uppercase tracking-widest text-[#21a0b5] focus:ring-2 focus:ring-[#21a0b5] transition-all">
                                            <option value="High">🔥 High</option>
                                            <option value="Medium">⚡ Medium</option>
                                            <option value="Low">🧊 Low</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Special Instructions</label>
                                        <textarea value={formState.notes} onChange={e => setFormState({ ...formState, notes: e.target.value })} placeholder="Maintenance details..." rows="3" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-[#21a0b5] transition-all resize-none" />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-50 mt-4">
                                    <button type="button" onClick={() => setShowWorkOrderModal(false)} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#21a0b5] transition-all">Authorize Order</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MaintenancePage;
