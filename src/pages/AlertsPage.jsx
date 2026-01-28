import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchAlerts();

        socketRef.current = io(API_BASE_URL);

        socketRef.current.on('new-alert', (newAlert) => {
            setAlerts(prev => [newAlert, ...prev]);
        });

        socketRef.current.on('alert-resolved', (resolvedAlert) => {
            setAlerts(prev => prev.map(a => a._id === resolvedAlert._id ? resolvedAlert : a));
        });

        return () => socketRef.current.disconnect();
    }, []);

    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/alerts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAlerts(data.alerts);
            }
        } catch (err) {
            console.error('Error fetching alerts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/alerts/${id}/resolve`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                if (selectedAlert?._id === id) {
                    setSelectedAlert(data.alert);
                }
            }
        } catch (err) {
            console.error('Error resolving alert:', err);
        }
    };

    const handleClearResolved = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/alerts/clear`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAlerts(prev => prev.filter(a => a.status !== 'Resolved'));
            }
        } catch (err) {
            console.error('Error clearing alerts:', err);
        }
    };

    const getSeverityStyle = (s) => {
        switch (s) {
            case 'Critical': return 'bg-red-500 text-white shadow-lg shadow-red-100';
            case 'Warning': return 'bg-amber-500 text-white shadow-lg shadow-amber-100';
            default: return 'bg-blue-500 text-white shadow-lg shadow-blue-100';
        }
    };

    const stats = {
        critical: alerts.filter(a => a.severity === 'Critical' && a.status === 'Unresolved').length,
        warning: alerts.filter(a => a.severity === 'Warning' && a.status === 'Unresolved').length,
        resolvedToday: alerts.filter(a => a.status === 'Resolved').length
    };

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Center <span className="text-[#21a0b5]">Alerts</span>
                    </motion.h1>
                    <div className="flex items-center gap-3">
                        <span className="flex h-2 w-2 rounded-full bg-[#21a0b5] animate-ping"></span>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Real-time security & safety monitoring active</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleClearResolved}
                        className="bg-white border border-gray-100 px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all text-gray-900"
                    >
                        🗑️ Clear Resolved
                    </button>
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                        ⚙️ Global Settings
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                    <p className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em] mb-4">Urgent Attention</p>
                    <div className="flex items-end gap-4">
                        <h5 className="text-6xl font-black text-gray-900 tracking-tighter">{stats.critical}</h5>
                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Critical Hits</p>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] mb-4">Pending Review</p>
                    <div className="flex items-end gap-4">
                        <h5 className="text-6xl font-black text-gray-900 tracking-tighter">{stats.warning}</h5>
                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Warnings</p>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a111a] p-10 rounded-[3rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#21a0b5]/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                    <p className="text-[10px] font-black uppercase text-[#21a0b5] tracking-[0.2em] mb-4">Resolution Pulse</p>
                    <div className="flex items-end gap-4">
                        <h5 className="text-6xl font-black text-white tracking-tighter">{stats.resolvedToday}</h5>
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Resolved Cases</p>
                    </div>
                </motion.div>
            </div>

            {/* Severity Filter */}
            <div className="flex gap-4 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm w-fit">
                {['All', 'Critical', 'Warning', 'Info', 'Resolved'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Alerts Feed */}
            <div className="grid grid-cols-1 gap-6 pb-20">
                {isLoading ? (
                    <div className="py-20 text-center animate-pulse text-gray-300 font-black uppercase tracking-widest text-xs">Syncing with Security Mainframe...</div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {alerts.filter(a => {
                            if (filter === 'All') return a.status !== 'Resolved';
                            if (filter === 'Resolved') return a.status === 'Resolved';
                            return a.severity === filter && a.status !== 'Resolved';
                        }).map((alert, i) => (
                            <motion.div
                                key={alert._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className={`group bg-white p-6 rounded-[2.5rem] border-2 shadow-sm flex items-center gap-8 hover:shadow-xl transition-all cursor-pointer ${alert.status === 'Resolved' ? 'border-gray-50 opacity-60' : alert.severity === 'Critical' ? 'border-red-50 hover:border-red-100' : 'border-gray-50 hover:border-[#21a0b5]/20'}`}
                                onClick={() => setSelectedAlert(alert)}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 duration-500 ${getSeverityStyle(alert.status === 'Resolved' ? 'Info' : alert.severity)}`}>
                                    {alert.type === 'Overspeed' ? '🚀' : alert.type === 'Geofence Exit' ? '🚩' : alert.type === 'Low Fuel' ? '⛽' : '⚠️'}
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">{alert.type}</h4>
                                            <p className="text-[9px] text-[#21a0b5] font-black uppercase tracking-widest">{alert.vehicle} • {alert.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-gray-400 uppercase block">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-[9px] font-bold text-gray-300 uppercase">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50">
                                        <p className="text-sm font-bold text-gray-600 italic">"{alert.detail}"</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {alert.status !== 'Resolved' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleResolve(alert._id); }}
                                            className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                    <button className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center text-xl text-gray-400 hover:text-[#21a0b5] hover:border-[#21a0b5] transition-all">👁️</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Alert Detail Modal */}
            <AnimatePresence>
                {selectedAlert && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAlert(null)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl relative z-10">
                            <div className={`h-4 ${getSeverityStyle(selectedAlert.status === 'Resolved' ? 'Info' : selectedAlert.severity)}`}></div>
                            <div className="p-16">
                                <header className="flex justify-between items-start mb-12">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${selectedAlert.severity === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>{selectedAlert.severity} Event</span>
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${selectedAlert.status === 'Resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-500'}`}>{selectedAlert.status}</span>
                                        </div>
                                        <h3 className="text-5xl font-black text-gray-900 uppercase tracking-tighter">{selectedAlert.type}</h3>
                                        <p className="text-sm font-bold text-[#21a0b5] tracking-widest uppercase">{selectedAlert.vehicle}</p>
                                    </div>
                                    <button onClick={() => setSelectedAlert(null)} className="text-3xl font-black text-gray-200 hover:text-gray-900">✕</button>
                                </header>

                                <div className="grid grid-cols-2 gap-10 mb-12">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Incident Location</p>
                                            <p className="text-xl font-black text-gray-900">{selectedAlert.location}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discovery Time</p>
                                            <p className="text-xl font-black text-gray-900">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Event Payload Detail</p>
                                        <p className="text-lg font-bold text-gray-700 leading-relaxed italic">"{selectedAlert.detail}"</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {selectedAlert.status !== 'Resolved' ? (
                                        <button
                                            onClick={() => handleResolve(selectedAlert._id)}
                                            className="flex-1 bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                                        >
                                            ✅ Mark as Resolved
                                        </button>
                                    ) : (
                                        <div className="flex-1 bg-emerald-50 text-emerald-600 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                            ✓ Resolution Complete
                                        </div>
                                    )}
                                    <button className="px-12 py-6 border-2 border-gray-100 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all">Support</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlertsPage;
