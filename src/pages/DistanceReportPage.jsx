import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DistanceReportPage = () => {
    const data = [
        { plate: 'HR-26-CZ-9021', today: 142, yesterday: 450, week: 1240, month: 4520, odometer: '84,212' },
        { plate: 'DL-01-BK-5521', today: 85, yesterday: 312, week: 980, month: 3120, odometer: '42,105' },
        { plate: 'UP-14-XY-7732', today: 12, yesterday: 124, week: 640, month: 2450, odometer: '12,900' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Distance <span className="text-[#21a0b5]">Matrix</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Granular travel metrics and odometer tracking</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-gray-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase text-gray-400">Previous Week</button>
                    <button className="bg-[#21a0b5] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-[#21a0b5]/20">Export All</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Fleet KM', value: '412,242', icon: '🛣️' },
                    { label: 'Today Covered', value: '4,120', icon: '⚡' },
                    { label: 'Avg per Vehicle', value: '142', icon: '📍' },
                    { label: 'Efficiency', value: '92%', icon: '📈' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{s.label}</p>
                            <h4 className="text-3xl font-black text-gray-900 tracking-tighter">{s.value}</h4>
                        </div>
                        <div className="text-3xl p-4 bg-gray-50 rounded-2xl">{s.icon}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Plate Number</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Today (km)</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Yesterday</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Month</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Odometer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-all font-bold group">
                                <td className="px-10 py-8 text-sm font-black text-gray-900 group-hover:text-[#21a0b5]">{row.plate}</td>
                                <td className="px-10 py-8 text-sm">{row.today}</td>
                                <td className="px-10 py-8 text-sm text-gray-400">{row.yesterday}</td>
                                <td className="px-10 py-8 text-sm text-[#21a0b5]">{row.month} km</td>
                                <td className="px-10 py-8 text-sm tracking-widest">{row.odometer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#0a111a] p-16 rounded-[4rem] text-white flex justify-between items-center text-center">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-[#21a0b5] tracking-widest">Longest Journey</p>
                    <h5 className="text-4xl font-black">DL-01-BK-5521</h5>
                    <p className="text-xs text-gray-500 uppercase font-black">412 km Continuous Run</p>
                </div>
                <div className="w-[1px] h-20 bg-white/10"></div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-[#21a0b5] tracking-widest">Highest Odometer</p>
                    <h5 className="text-4xl font-black italic">UP-14-XY-7732</h5>
                    <p className="text-xs text-gray-500 uppercase font-black">1.4L + Total km</p>
                </div>
            </div>
        </div>
    );
};

export default DistanceReportPage;
