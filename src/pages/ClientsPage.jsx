import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ClientsPage = () => {
    const clients = [
        { id: 1, name: 'Reliance Logistics', contact: 'Anil Ambani', vehicles: 42, active: 38, status: 'Premium' },
        { id: 2, name: 'Adani Ports', contact: 'Gautam Adani', vehicles: 120, active: 115, status: 'Enterprise' },
        { id: 3, name: 'Tata Steel', contact: 'Ratan Tata', vehicles: 65, active: 62, status: 'Enterprise' },
        { id: 4, name: 'Zomato Delivery', contact: 'Deepinder Goyal', vehicles: 200, active: 185, status: 'Growth' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Client <span className="text-[#21a0b5]">Portfolio</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage enterprise accounts and fleet subscriptions</p>
                </div>
                <button className="bg-[#21a0b5] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">
                    ➕ Add Corporate Client
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clients.map((c, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl group-hover:bg-[#21a0b5]/10 transition-all opacity-20">🏢</div>
                        <p className={`text-[8px] font-black uppercase tracking-widest mb-2 ${c.status === 'Enterprise' ? 'text-purple-500' : 'text-[#21a0b5]'}`}>{c.status}</p>
                        <h3 className="text-xl font-black text-gray-900 mb-1 truncate">{c.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-6 tracking-wide">{c.contact}</p>

                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase">Vehicles</p>
                                <p className="text-lg font-black text-gray-900">{c.vehicles}</p>
                            </div>
                            <div className="h-8 w-[1px] bg-gray-200"></div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase">Live</p>
                                <p className="text-lg font-black text-emerald-500">{c.active}</p>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-4 rounded-xl border border-gray-100 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">Manage Account</button>
                    </motion.div>
                ))}
            </div>

            <div className="bg-[#0a111a] p-12 rounded-[3.5rem] text-white flex items-center justify-between">
                <div>
                    <h3 className="text-4xl font-black tracking-tighter uppercase mb-2">Billing <span className="text-[#21a0b5]">Overview</span></h3>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Outstanding invoices and subscription renewals</p>
                </div>
                <div className="flex gap-12">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Due Amount</p>
                        <p className="text-3xl font-black text-red-400">₹8,42,000</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Paid this Month</p>
                        <p className="text-3xl font-black text-emerald-400">₹24,50,000</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientsPage;
