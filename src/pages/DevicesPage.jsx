import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DevicesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [devices, setDevices] = useState([
        { id: 'IMEI-864002931', type: 'GT06 Protocol', vehicle: 'HR-26-CZ-9021', signal: 95, battery: 100, lastPing: '2 mins ago', status: 'Online' },
        { id: 'IMEI-864002945', type: 'OBDII Smart', vehicle: 'DL-01-BK-5521', signal: 82, battery: 0, lastPing: '1 hour ago', status: 'Online' },
        { id: 'IMEI-864002999', type: 'Asset Tracker', vehicle: 'Unassigned', signal: 0, battery: 12, lastPing: '2 days ago', status: 'Offline' },
    ]);

    return (
        <div className="space-y-6 pb-20">
            {/* Header section */}
            <div className="text-center space-y-4 py-4 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-gray-900 tracking-tighter uppercase">
                    Device <span className="text-[#21a0b5]">Management</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Configure and Monitor GPS Hardware</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
            </div>

            {/* Device Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Devices', value: 142, icon: '🛰️', color: 'text-blue-500' },
                    { label: 'Offline', value: 3, icon: '🔌', color: 'text-red-500' },
                    { label: 'Low Battery', value: 8, icon: '🪫', color: 'text-amber-500' },
                    { label: 'Signal Quality', value: '94%', icon: '📶', color: 'text-emerald-500' },
                ].map((s, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400">{s.label}</p>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">{s.value}</h4>
                        </div>
                        <div className={`text-2xl p-4 bg-gray-50 rounded-xl ${s.color}`}>{s.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* Search and Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mt-10">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div className="relative w-96">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                        <input
                            type="text"
                            placeholder="Search IMEI or Protocol..."
                            className="w-full pl-10 pr-6 py-3 bg-white rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#21a0b5] transition-all outline-none text-sm font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-[#21a0b5] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">
                        ➕ Register Device
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Device Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Linked Vehicle</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Signal & Power</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Last Sync</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {devices.map((d, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-gray-800 tracking-tight">{d.id}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{d.type}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${d.vehicle === 'Unassigned' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {d.vehicle}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.signal}%` }}></div>
                                                </div>
                                                <span className="text-[9px] font-black text-gray-400 uppercase">📶 {d.signal}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#21a0b5] rounded-full" style={{ width: `${d.battery}%` }}></div>
                                                </div>
                                                <span className="text-[9px] font-black text-gray-400 uppercase">🔋 {d.battery}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase">{d.lastPing}</td>
                                    <td className="px-8 py-6">
                                        <button className="text-[#21a0b5] font-black uppercase text-[10px] tracking-widest mr-4 hover:underline">Config</button>
                                        <button className="text-red-400 font-black uppercase text-[10px] tracking-widest hover:underline">Reset</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DevicesPage;
