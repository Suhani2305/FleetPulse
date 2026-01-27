import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementsPage = () => {
    const broadcasts = [
        { id: 1, title: 'Server Maintenance Notice', type: 'Alert', content: 'FleetPulse backend will undergo scheduled maintenance on Oct 30 from 02:00 AM to 04:00 AM. Live tracking might be interrupted.', time: '2h ago', priority: 'High' },
        { id: 2, title: 'New Fleet Analytics v2.1', type: 'Update', content: 'We have updated the analytics engine. You can now see deep fuel projections in the Intelligence module.', time: 'Oct 24', priority: 'Medium' },
        { id: 3, title: 'Policy Update: Over-speeding', type: 'Notice', content: 'New over-speeding slab rates have been adjusted for National Highways as per RTO guidelines.', time: 'Oct 20', priority: 'Low' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        System <span className="text-[#21a0b5]">Broadcasts</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Official updates, alerts and policy announcements</p>
                </div>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase shadow-xl hover:bg-[#21a0b5] transition-all">
                    📢 Create Broadcast
                </button>
            </div>

            <div className="space-y-6">
                {broadcasts.map((b, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={b.id}
                        className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex gap-10 items-start hover:shadow-lg transition-all"
                    >
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-lg ${b.type === 'Alert' ? 'bg-red-500 text-white shadow-red-200' : b.type === 'Update' ? 'bg-[#21a0b5] text-white shadow-blue-200' : 'bg-gray-900 text-white shadow-gray-200'}`}>
                            {b.type === 'Alert' ? '📢' : b.type === 'Update' ? '🚀' : '📝'}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{b.title}</h3>
                                    <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1 rounded-md">{b.type}</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase">{b.time}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-600 leading-relaxed max-w-4xl italic">
                                "{b.content}"
                            </p>
                            <div className="flex gap-4 pt-4 border-t border-gray-50">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${b.priority === 'High' ? 'border-red-500 text-red-500' : 'border-gray-200 text-gray-400'}`}>
                                    Priority: {b.priority}
                                </span>
                                <button className="text-[10px] font-black uppercase text-[#21a0b5] hover:underline">Read Policy Details</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-[#0a111a] p-12 rounded-[4rem] text-white flex justify-between items-center overflow-hidden relative">
                <div className="relative z-10">
                    <h4 className="text-3xl font-black tracking-tighter uppercase mb-2">Automated <span className="text-[#21a0b5]">Emailer</span></h4>
                    <p className="text-sm font-bold opacity-60 italic mb-8 uppercase tracking-widest text-[10px]">Send these broadcasts to all registered client emails automatically.</p>
                    <button className="bg-white text-gray-900 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#21a0b5] hover:text-white transition-all">Configure Mailing List</button>
                </div>
                <div className="text-[12rem] opacity-5 font-black uppercase italic absolute -right-10 -bottom-10 select-none">MAIL</div>
            </div>
        </div>
    );
};

export default AnnouncementsPage;
