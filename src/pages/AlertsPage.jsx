import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertsPage = () => {
    const [filter, setFilter] = useState('Critical');

    const alerts = [
        { id: 1, type: 'Overspeed', vehicle: 'HR-26-CZ-9021', location: 'DND Flyway, Delhi', time: '12:42 PM', severity: 'Critical', detail: 'Clocked at 112 km/h in 60 km/h zone' },
        { id: 2, type: 'Geofence Exit', vehicle: 'DL-01-BK-5521', location: 'Okhla Phase III', time: '11:15 AM', severity: 'Warning', detail: 'Left designated delivery zone' },
        { id: 3, type: 'Low Fuel', vehicle: 'UP-14-XY-7732', location: 'Noida Sector 62', time: '10:30 AM', severity: 'Info', detail: 'Fuel level below 15%' },
        { id: 4, type: 'Harsh Braking', vehicle: 'HR-26-CZ-9021', location: 'Gurugram Sector 14', time: '09:45 AM', severity: 'Warning', detail: 'Sudden deceleration detected' },
    ];

    const getSeverityStyle = (s) => {
        switch (s) {
            case 'Critical': return 'bg-red-500 text-white shadow-red-200';
            case 'Warning': return 'bg-amber-500 text-white shadow-amber-200';
            default: return 'bg-blue-500 text-white shadow-blue-200';
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Center <span className="text-[#21a0b5]">Alerts</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Real-time system notifications and safety events</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-gray-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">
                        Clear All
                    </button>
                    <button className="bg-[#21a0b5] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">
                        Export Logs
                    </button>
                </div>
            </div>

            {/* Severity Filter */}
            <div className="flex gap-4 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit">
                {['All', 'Critical', 'Warning', 'Info'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Alerts Feed */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {alerts.filter(a => filter === 'All' || a.severity === filter).map((alert, i) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-8 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-2xl shadow-lg ${getSeverityStyle(alert.severity)}`}>
                                {alert.type === 'Overspeed' ? '🏎️' : alert.type === 'Geofence Exit' ? '🚩' : alert.type === 'Low Fuel' ? '⛽' : '⚠️'}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{alert.type}</h4>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{alert.vehicle} • {alert.location}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{alert.time}</span>
                                </div>
                                <p className="text-sm font-bold text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100/50 italic">
                                    "{alert.detail}"
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button className="bg-gray-900 text-white p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Resolve</button>
                                <button className="text-gray-300 hover:text-[#21a0b5] transition-colors p-2 text-2xl">👁️</button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Statistics Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100">
                    <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1">Today's Critical</p>
                    <h5 className="text-5xl font-black text-red-600 tracking-tighter">14</h5>
                    <p className="text-[9px] font-bold text-red-400 uppercase mt-4">High Risk • Immediate Action Required</p>
                </div>
                <div className="bg-amber-50 p-10 rounded-[3rem] border border-amber-100">
                    <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest mb-1">Warnings</p>
                    <h5 className="text-5xl font-black text-amber-600 tracking-tighter">42</h5>
                    <p className="text-[9px] font-bold text-amber-400 uppercase mt-4">Policy Violations • Monitoring</p>
                </div>
                <div className="bg-[#21a0b5]/5 p-10 rounded-[3rem] border border-[#21a0b5]/10">
                    <p className="text-[10px] font-black uppercase text-[#21a0b5] tracking-widest mb-1">System Pulse</p>
                    <h5 className="text-5xl font-black text-[#21a0b5] tracking-tighter">Stable</h5>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-4">All Sensors Online • IoT Sync Active</p>
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;
