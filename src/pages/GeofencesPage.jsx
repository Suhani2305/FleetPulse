import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GeofencesPage = () => {
    const [geofences, setGeofences] = useState([
        { id: 1, name: 'Main Warehouse', color: '#21a0b5', address: 'Plot 12, Okhla Phase III, New Delhi', type: 'Polygon', alerts: 'Enter/Exit' },
        { id: 2, name: 'Safe Zone Delhi', color: '#10b981', address: 'Delhi NCR Region', type: 'Circle (15km)', alerts: 'Exit only' },
        { id: 3, name: 'Restricted Area', color: '#ef4444', address: 'Military Cantonment Area', type: 'Polygon', alerts: 'Enter only' },
    ]);

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Virtual <span className="text-[#21a0b5]">Boundaries</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage Geofences and Exclusion Zones</p>
                </div>
                <button className="bg-[#21a0b5] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">
                    ➕ Create Geofence
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List of Geofences */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 pb-4">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Saved Geofences</h4>
                        </div>
                        <div className="space-y-1 p-4">
                            {geofences.map((g, i) => (
                                <motion.div
                                    key={g.id}
                                    whileHover={{ x: 5 }}
                                    className="p-6 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: g.color }}></div>
                                            <h5 className="font-black text-gray-900 uppercase tracking-tight">{g.name}</h5>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 group-hover:text-[#21a0b5]">EDIT</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">{g.address}</p>
                                    <div className="flex gap-4">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{g.type}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">🔔 {g.alerts}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0a111a] p-10 rounded-[3rem] text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black uppercase italic mb-4">Polygon Tool <span className="text-[#21a0b5]">Pro</span></h4>
                            <p className="text-xs text-gray-400 leading-relaxed mb-8">Draw highly precise boundaries with multi-point polygon mapping. Accuracy up to 5 meters.</p>
                            <button className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest w-full transition-all">Launch Designer</button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 group-hover:rotate-12 transition-transform">📐</div>
                    </div>
                </div>

                {/* Map Interface */}
                <div className="lg:col-span-8 bg-white border border-gray-100 rounded-[3.5rem] overflow-hidden relative shadow-sm h-[800px]">
                    <img src="/src/assets/dark_fleet_map_mockup.png" className="w-full h-full object-cover opacity-90" alt="Geofence Map" />

                    {/* Tool Palette */}
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                        {[
                            { icon: '🖐️', label: 'Pan' },
                            { icon: '⚪', label: 'Circle' },
                            { icon: '⬟', label: 'Polygon' },
                            { icon: '🟩', label: 'Rect' },
                            { icon: '📍', label: 'Marker' },
                        ].map((tool, i) => (
                            <button key={i} className={`w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-xl hover:bg-[#21a0b5] hover:text-white transition-all ${i === 2 ? 'bg-[#21a0b5] text-white' : ''}`}>
                                {tool.icon}
                            </button>
                        ))}
                    </div>

                    {/* Zone Info Card Overlay */}
                    <div className="absolute bottom-10 right-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl w-96 space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black uppercase text-gray-900 tracking-tight">Zone Properties</h3>
                                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">🛑</div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Boundary Name</label>
                                    <input type="text" placeholder="e.g. Forbidden Area" className="w-full bg-gray-50 p-4 rounded-xl text-xs font-bold border-none ring-1 ring-gray-100" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Vehicle Assignment</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-[#21a0b5]/10 text-[#21a0b5] px-3 py-1 rounded-full text-[9px] font-black uppercase">Fleet All</span>
                                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">+ Custom</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button className="flex-1 bg-gray-50 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">Discard</button>
                                <button className="flex-1 bg-[#21a0b5] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Save Zone</button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeofencesPage;
