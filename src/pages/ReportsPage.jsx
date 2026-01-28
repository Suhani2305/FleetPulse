import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReportsPage = () => {
    const reportTypes = [
        { title: 'Distance & Travel', desc: 'Summary of total km covered by each vehicle', icon: '📏' },
        { title: 'Fuel Consumption', desc: 'Detailed fuel usage and refill logs', icon: '⛽' },
        { title: 'Idle Time Report', desc: 'Analysis of engine idle vs moving duration', icon: '⏱️' },
        { title: 'Stay Point Analysis', desc: 'Locations where vehicles stopped for >15 mins', icon: '📍' },
        { title: 'Over-speed Logs', desc: 'List of all speed limit violations', icon: '🏎️' },
        { title: 'Driver Scorecard', desc: 'Safety and efficiency ratings for all drivers', icon: '🏆' },
    ];

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Header section (Unified Live Map Style) */}
            <div className="text-center space-y-3 py-6 relative">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none"
                >
                    Fleet <span className="text-[#21a0b5]">Intelligence</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] md:text-[10px]">
                    Generate and Export Professional Analytical Reports
                </p>
                <div className="w-12 md:w-16 h-1 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-3"></div>
            </div>

            {/* Quick Filter Bar */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-wrap gap-6 items-center">
                <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Select Vehicle</label>
                    <select className="w-full bg-gray-50 border-none ring-1 ring-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#21a0b5]">
                        <option>All Vehicles</option>
                        <option>HR-26-CZ-9021</option>
                        <option>DL-01-BK-5521</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Date Range</label>
                    <input type="date" className="w-full bg-gray-50 border-none ring-1 ring-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#21a0b5]" />
                </div>
                <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Format</label>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-emerald-50 text-emerald-600 p-4 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-100 transition-all">Excel</button>
                        <button className="flex-1 bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase hover:bg-red-100 transition-all">PDF</button>
                    </div>
                </div>
            </div>

            {/* Report Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reportTypes.map((report, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                    >
                        <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{report.icon}</div>
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">{report.title}</h4>
                        <p className="text-xs text-gray-400 font-bold leading-relaxed mb-8">{report.desc}</p>
                        <button className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-[#21a0b5] transition-all">
                            Generate Report
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Recent Exports */}
            <div className="bg-[#0a111a] p-12 rounded-[3.5rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5 text-20xl leading-none font-black italic select-none">DATA</div>
                <h3 className="text-2xl font-black mb-10 tracking-tight uppercase border-l-4 border-[#21a0b5] pl-6">Recent Downloads</h3>
                <div className="space-y-4 relative z-10">
                    {[
                        { name: 'Monthly_Fuel_Sept.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 12' },
                        { name: 'Fleet_Performance_Q3.xlsx', type: 'Excel', size: '1.1 MB', date: 'Oct 10' },
                        { name: 'Speed_Violation_Log.pdf', type: 'PDF', size: '840 KB', date: 'Oct 08' },
                    ].map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                            <div className="flex items-center gap-6">
                                <span className={`w-12 h-12 flex items-center justify-center rounded-xl font-black ${file.type === 'PDF' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                    {file.type === 'PDF' ? '📄' : '📊'}
                                </span>
                                <div>
                                    <p className="font-bold">{file.name}</p>
                                    <p className="text-[10px] text-gray-500 font-black uppercase">{file.size} • {file.date}</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-black uppercase text-[#21a0b5] group-hover:underline">Download Again</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
