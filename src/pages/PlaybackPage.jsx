import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PlaybackPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Route <span className="text-[#21a0b5]">Playback</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Replay history and route analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Configuration</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block">Vehicle</label>
                                    <select className="w-full bg-gray-50 border-none ring-1 ring-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#21a0b5]">
                                        <option>HR-26-CZ-9021</option>
                                        <option>DL-01-BK-5521</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block">Date & Time</label>
                                    <input type="datetime-local" className="w-full bg-gray-50 border-none ring-1 ring-gray-100 p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#21a0b5]" />
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-[#21a0b5] text-white py-5 rounded-[1.5rem] font-black tracking-widest uppercase text-xs shadow-xl shadow-[#21a0b5]/20 hover:bg-[#1a8396] transition-all">
                            Load History
                        </button>
                    </div>

                    <div className="bg-[#0a111a] p-8 rounded-[2.5rem] text-white space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Route Stats</h4>
                            <span className="text-[10px] bg-[#21a0b5] px-2 py-1 rounded-md font-black">ACTIVE</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase">Distance</p>
                                <p className="text-xl font-black">124.2 <span className="text-[10px] opacity-40">km</span></p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase">Avg Speed</p>
                                <p className="text-xl font-black">54 <span className="text-[10px] opacity-40">km/h</span></p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase">Max Speed</p>
                                <p className="text-xl font-black text-red-400">92 <span className="text-[10px] opacity-40">km/h</span></p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase">Spent</p>
                                <p className="text-xl font-black">3h 42m</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulation Canvas */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="h-[600px] bg-white border border-gray-100 rounded-[3rem] overflow-hidden relative shadow-sm group">
                        <img src="/src/assets/dark_fleet_map_mockup.png" className="w-full h-full object-cover opacity-80" alt="Playback Map" />

                        {/* Playback Controls Overlay */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-200 shadow-2xl flex flex-col gap-6">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-16 h-16 bg-[#21a0b5] text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-[#21a0b5]/20 hover:scale-110 transition-all active:scale-95"
                                    >
                                        {isPlaying ? '⏸️' : '▶️'}
                                    </button>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-2 bg-gray-100 rounded-full cursor-pointer relative group">
                                            <div className="absolute top-1/2 left-[40%] -translate-y-1/2 w-4 h-4 bg-white border-4 border-[#21a0b5] rounded-full shadow-md z-10 transition-transform group-hover:scale-125"></div>
                                            <div className="h-full bg-[#21a0b5] rounded-full" style={{ width: '40%' }}></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <span>09:00 AM</span>
                                            <span>Current: 11:24 AM</span>
                                            <span>06:00 PM</span>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-xl">
                                        {[1, 5, 10].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSpeed(s)}
                                                className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${speed === s ? 'bg-white text-[#21a0b5] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Violations & Stops Along Route</h4>
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {[
                                { time: '10:12 AM', type: 'Stop', detail: '14 min @ Petrol Pump', icon: '⛽' },
                                { time: '11:05 AM', type: 'Overspeed', detail: '94 km/h @ NH-44', icon: '🏎️' },
                                { time: '11:45 AM', type: 'Geofence', detail: 'Entered Zone A', icon: '🚩' },
                                { time: '01:20 PM', type: 'Stop', detail: '1h 2m @ Warehouse', icon: '🏢' },
                            ].map((evt, i) => (
                                <div key={i} className="min-w-[200px] bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-3 group hover:border-[#21a0b5] transition-all">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl">{evt.icon}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{evt.time}</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-xs uppercase text-gray-900">{evt.type}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">{evt.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaybackPage;
