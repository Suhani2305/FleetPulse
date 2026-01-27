import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TransportersPage = () => {
    const transporters = [
        { id: 1, name: 'North India Express', base: 'Ludhiana', fleet: 85, rating: 4.8, reliability: '98%' },
        { id: 2, name: 'South Coast Logistics', base: 'Chennai', fleet: 54, rating: 4.5, reliability: '94%' },
        { id: 3, name: 'Western Cargo Hub', base: 'Mumbai', fleet: 112, rating: 4.9, reliability: '99%' },
        { id: 4, name: 'Eastern Wings', base: 'Kolkata', fleet: 32, rating: 4.2, reliability: '89%' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="text-center space-y-4 py-4 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-gray-900 tracking-tighter uppercase">
                    Transporter <span className="text-[#21a0b5]">Network</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Manage Third-Party Vendors and Logistics Partners</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Company Identity</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Base Hub</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Managed Fleet</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Reliability</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transporters.map((t, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                <td className="px-8 py-8">
                                    <p className="text-lg font-black text-gray-900 tracking-tight">{t.name}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} className={`text-[10px] ${star <= Math.floor(t.rating) ? 'text-amber-400' : 'text-gray-100'}`}>⭐</span>
                                        ))}
                                        <span className="text-[9px] font-black text-gray-400 uppercase ml-2">{t.rating} Score</span>
                                    </div>
                                </td>
                                <td className="px-8 py-8">
                                    <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{t.base}</span>
                                </td>
                                <td className="px-8 py-8">
                                    <p className="text-2xl font-black text-gray-800 tracking-tighter">{t.fleet}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase">Registered Assets</p>
                                </td>
                                <td className="px-8 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: t.reliability }}></div>
                                        </div>
                                        <span className="text-xs font-black text-gray-900">{t.reliability}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-8">
                                    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#21a0b5] transition-all">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#21a0b5] p-12 rounded-[3.5rem] text-white">
                    <h4 className="text-3xl font-black uppercase tracking-tighter mb-4">Onboard New Hub</h4>
                    <p className="text-sm font-bold opacity-80 mb-8 leading-relaxed italic">Expand your network coverage by inviting third-party transporters to your fleet dashboard.</p>
                    <button className="bg-white text-[#21a0b5] px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">Apply for Gateway</button>
                </div>
                <div className="bg-gray-900 p-12 rounded-[3.5rem] text-white flex flex-col justify-center">
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Vendor Compliance</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-8">Verification status for all registered companies</p>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-[#21a0b5]">92% Verified</p>
                        </div>
                        <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-red-500">8 Suspended</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportersPage;
