import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TechniciansPage = () => {
    const technicians = [
        { id: 'T-102', name: 'Rohan Sharma', expertise: 'GPS Installation', status: 'On Site', zone: 'Delhi NCR', jobs: 242 },
        { id: 'T-105', name: 'Sandeep Varma', expertise: 'IoT Diagnostics', status: 'Available', zone: 'Mumbai Hub', jobs: 185 },
        { id: 'T-108', name: 'Priya Kumari', expertise: 'Hardware Repair', status: 'On Break', zone: 'Bengaluru', jobs: 94 },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Service <span className="text-[#21a0b5]">Engineers</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage Field Staff and Hardware Technicians</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-gray-100 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">Assign Work Order</button>
                    <button className="bg-[#21a0b5] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20">➕ New Hire</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {technicians.map((t, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm group">
                        <div className="flex justify-between items-start mb-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-3xl group-hover:bg-[#21a0b5] group-hover:text-white transition-all">👨‍🔧</div>
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${t.status === 'Available' ? 'bg-emerald-50 text-emerald-500' : t.status === 'On Site' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
                                {t.status}
                            </span>
                        </div>
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-1">{t.name}</h4>
                        <p className="text-[10px] text-[#21a0b5] font-black uppercase tracking-widest mb-6">{t.expertise}</p>

                        <div className="space-y-3 pb-8 border-b border-gray-50">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">ID Node</span>
                                <span className="text-gray-900">{t.id}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">Current Zone</span>
                                <span className="text-gray-900">{t.zone}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">Jobs Fixed</span>
                                <span className="text-gray-900">{t.jobs} Units</span>
                            </div>
                        </div>

                        <div className="pt-8 flex gap-3">
                            <button className="flex-1 bg-gray-900 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Track</button>
                            <button className="flex-1 border border-gray-100 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-900">Reach</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-[#0a111a] p-12 rounded-[4rem] text-white flex gap-12 items-center overflow-hidden relative">
                <div className="flex-1 relative z-10">
                    <h3 className="text-4xl font-black tracking-tighter uppercase mb-2">Service <span className="text-[#21a0b5]">Coverage Map</span></h3>
                    <p className="text-sm font-bold opacity-60 italic mb-8">Visualization of technical staff distribution across national hubs.</p>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-4xl font-black text-white">42</p>
                            <p className="text-[9px] font-black text-gray-500 uppercase">Field Experts</p>
                        </div>
                        <div className="w-[1px] h-12 bg-white/10"></div>
                        <div>
                            <p className="text-4xl font-black text-[#21a0b5]">8.4m</p>
                            <p className="text-[9px] font-black text-gray-500 uppercase">Avg Response Time</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 h-64 bg-white/5 rounded-[3rem] border border-white/5 flex items-center justify-center text-gray-700 font-black italic uppercase tracking-widest text-[10px]">
                    Regional heatmap connection pending...
                </div>
            </div>
        </div>
    );
};

export default TechniciansPage;
