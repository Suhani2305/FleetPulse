import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CompliancePage = () => {
    const documents = [
        { id: 1, vehicle: 'HR-26-CZ-9021', type: 'Pollution (PUC)', expiry: 'Oct 24, 2026', daysLeft: 242, status: 'Valid' },
        { id: 2, vehicle: 'DL-01-BK-5521', type: 'Vehicle Insurance', expiry: 'Oct 15, 2026', daysLeft: -12, status: 'Expired' },
        { id: 3, vehicle: 'UP-14-XY-7732', type: 'RTO Tax Receipt', expiry: 'Nov 02, 2026', daysLeft: 5, status: 'Expiring Soon' },
        { id: 4, vehicle: 'MH-12-RT-4421', type: 'National Permit', expiry: 'Dec 12, 2026', daysLeft: 45, status: 'Valid' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-4 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-gray-900 tracking-tighter uppercase">
                    Legal <span className="text-[#21a0b5]">Vault</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Verify Licenses, Insurance and RC Compliance</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
            </div>

            {/* Document Health */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Verified Files', value: '422', color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Expired Docs', value: '08', color: 'bg-red-50 text-red-600' },
                    { label: 'Pending Review', value: '14', color: 'bg-amber-50 text-amber-600' },
                    { label: 'Total Scans', value: '1,242', color: 'bg-gray-50 text-gray-400' },
                ].map((s, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border border-gray-100 shadow-sm ${s.color}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
                        <h4 className="text-4xl font-black tracking-tighter">{s.value}</h4>
                    </div>
                ))}
            </div>

            {/* Compliance Feed */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase text-gray-900 tracking-tight">Status Monitor</h3>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Filter Plate..." className="bg-gray-50 px-6 py-3 rounded-xl text-xs font-bold border-none ring-1 ring-gray-100 outline-none" />
                        <button className="bg-gray-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Scan New Doc</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Document Type</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Expiry Date</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Compliance</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {documents.map((d, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all">
                                    <td className="px-10 py-8 text-sm font-black text-gray-900 uppercase tracking-tight">{d.vehicle}</td>
                                    <td className="px-10 py-8">
                                        <p className="text-xs font-bold text-gray-600">{d.type}</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-xs font-black text-gray-900">{d.expiry}</p>
                                        <p className={`text-[9px] font-black uppercase mt-1 ${d.daysLeft < 0 ? 'text-red-500' : d.daysLeft < 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {d.daysLeft < 0 ? `${Math.abs(d.daysLeft)} Days Overdue` : `${d.daysLeft} Days Remaining`}
                                        </p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${d.status === 'Valid' ? 'bg-emerald-50 text-emerald-500' : d.status === 'Expired' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500 animate-pulse'}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <button className="text-[#21a0b5] font-black uppercase text-[10px] tracking-widest hover:underline">Verify</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Smart Audit Banner */}
            <div className="bg-[#0a111a] p-16 rounded-[4rem] text-white flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#21a0b5]/10 to-transparent"></div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-4xl font-black uppercase tracking-tighter">Automated <span className="text-[#21a0b5]">Cloud Audit</span></h4>
                    <p className="text-sm font-bold opacity-60 max-w-2xl mx-auto uppercase tracking-wide">AI Engine automatically fetches document status from Vahan/mParivahan gateways everyday at 04:00 AM.</p>
                </div>
                <div className="relative z-10 flex gap-6">
                    <div className="bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                        <p className="text-4xl font-black mb-2">94%</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fleet Compliance Score</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                        <p className="text-4xl font-black mb-2 text-red-400">12</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Immediate Fixes Need</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompliancePage;
