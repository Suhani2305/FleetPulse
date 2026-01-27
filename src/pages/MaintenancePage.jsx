import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MaintenancePage = () => {
    const [schedule, setSchedule] = useState([
        { id: 1, vehicle: 'HR-26-CZ-9021', service: 'Oil Change & Filter', dueDate: 'Oct 24, 2026', mileage: '45,000 km', status: 'Upcoming', priority: 'Medium' },
        { id: 2, vehicle: 'DL-01-BK-5521', service: 'Brake Pad Replacement', dueDate: 'Oct 20, 2026', mileage: '32,400 km', status: 'Overdue', priority: 'High' },
        { id: 3, vehicle: 'UP-14-XY-7732', service: 'Tyre Rotation', dueDate: 'Oct 30, 2026', mileage: '12,000 km', status: 'Scheduled', priority: 'Low' },
    ]);

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-4 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-gray-900 tracking-tighter uppercase">
                    Asset <span className="text-[#21a0b5]">Care</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Preventive Maintenance and Repair Scheduling</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl">⚠️</div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400">Overdue Service</p>
                        <h4 className="text-3xl font-black text-gray-900">03</h4>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-[#21a0b5] rounded-2xl flex items-center justify-center text-3xl">🔧</div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400">In Workshop</p>
                        <h4 className="text-3xl font-black text-gray-900">05</h4>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-3xl">✅</div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400">Healthy Fleet</p>
                        <h4 className="text-3xl font-black text-gray-900">134</h4>
                    </div>
                </div>
            </div>

            {/* Content Tabs Header */}
            <div className="flex justify-between items-center mt-12 bg-gray-900 p-4 rounded-[2rem] shadow-xl">
                <div className="flex gap-4">
                    {['Active Schedule', 'Workshop History', 'Parts Inventory'].map((tab, i) => (
                        <button key={i} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <button className="bg-[#21a0b5] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a8396] transition-all">
                    ➕ Create Work Order
                </button>
            </div>

            {/* Maintenance List */}
            <div className="space-y-4">
                {schedule.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#21a0b5]/30 transition-all"
                    >
                        <div className="flex items-center gap-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${item.status === 'Overdue' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                                {item.id}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight">{item.service}</h4>
                                <div className="flex gap-4 mt-1">
                                    <span className="text-[10px] font-black text-[#21a0b5] uppercase tracking-widest">{item.vehicle}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• Current: {item.mileage}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 text-right">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
                                <p className="text-sm font-black text-gray-900">{item.dueDate}</p>
                            </div>
                            <div className="w-32">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Priority</p>
                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${item.priority === 'High' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.priority}
                                </span>
                            </div>
                            <button className="h-14 w-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl group-hover:bg-[#21a0b5] transition-all">
                                →
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Maintenance Advice */}
            <div className="bg-emerald-500 p-12 rounded-[3.5rem] text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">AI Maintenance Advisor</h3>
                    <p className="text-sm font-bold opacity-90 leading-relaxed mb-8 italic">
                        "Based on the current driving patterns of HR-26-CZ-9021, we recommend scheduling an early tire inspection. Frequent harsh braking in Gurugram traffic has increased the wear rate by 14%."
                    </p>
                    <button className="bg-white text-emerald-600 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-700/20 hover:scale-105 transition-all">
                        Review Insights
                    </button>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-10 text-[15rem] leading-none pointer-events-none">🤖</div>
            </div>
        </div>
    );
};

export default MaintenancePage;
