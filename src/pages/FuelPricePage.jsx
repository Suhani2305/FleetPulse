import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FuelPricePage = () => {
    const prices = [
        { city: 'New Delhi', petrol: '96.72', diesel: '89.62', trend: 'down', change: '-0.15' },
        { city: 'Mumbai', petrol: '106.31', diesel: '94.27', trend: 'up', change: '+0.10' },
        { city: 'Bengaluru', petrol: '101.94', diesel: '87.89', trend: 'stable', change: '0.00' },
        { city: 'Chennai', petrol: '102.63', diesel: '94.24', trend: 'down', change: '-0.05' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Fuel <span className="text-[#21a0b5]">Intelligence</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Real-time fuel indexing and consumption analysis</p>
                </div>
                <button className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20">Update Fuel Rates</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {prices.map((p, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform text-6xl italic font-black">⛽</div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 border-b border-gray-50 pb-4">{p.city}</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Petrol / L</p>
                                    <h5 className="text-2xl font-black text-gray-900">₹{p.petrol}</h5>
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${p.trend === 'up' ? 'text-red-500 bg-red-50' : p.trend === 'down' ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 bg-gray-50'}`}>
                                    {p.change !== '0.00' ? p.change : 'FIXED'}
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Diesel / L</p>
                                    <h5 className="text-2xl font-black text-[#21a0b5]">₹{p.diesel}</h5>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-[#0a111a] p-12 rounded-[4rem] text-white">
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-8 border-l-4 border-emerald-500 pl-6">Fleet Consumption Projection</h4>
                    <div className="h-64 flex items-end gap-6 pb-4 border-b border-white/5">
                        {[45, 62, 58, 75, 52, 68, 82].map((v, i) => (
                            <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-xl group relative cursor-pointer hover:bg-emerald-500 transition-all" style={{ height: `${v}%` }}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{v * 105}k</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-gray-500 px-2 tracking-widest">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm flex flex-col justify-center space-y-8">
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Avg Fleet Efficiency</p>
                        <h4 className="text-4xl font-black text-gray-900 tracking-tighter">14.2 km/L</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Fuel Spend / Oct</p>
                            <p className="text-2xl font-black text-gray-900">₹8,42,120</p>
                        </div>
                        <button className="w-full bg-gray-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Detailed Audit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuelPricePage;
