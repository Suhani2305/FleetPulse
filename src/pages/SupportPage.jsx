import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SupportPage = () => {
    return (
        <div className="space-y-10 pb-20">
            <div className="text-center space-y-4 py-12 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl font-black text-gray-900 tracking-tighter uppercase">
                    Help <span className="text-[#21a0b5]">Center</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.5em] text-xs">Technical Support and Knowledge Base</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <motion.div whileHover={{ y: -10 }} className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm text-center space-y-8">
                    <div className="text-5xl">📖</div>
                    <div>
                        <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tight mb-2">User Manuals</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Step-by-step guides for fleet configuration and hardware setup.</p>
                    </div>
                    <button className="w-full py-5 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#21a0b5] hover:text-white transition-all">Browse Library</button>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm text-center space-y-8">
                    <div className="text-5xl">🛠️</div>
                    <div>
                        <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tight mb-2">Open Ticket</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Facing issues with IoT sync or backend lag? Contact us.</p>
                    </div>
                    <button className="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Submit Case</button>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm text-center space-y-8">
                    <div className="text-5xl">💬</div>
                    <div>
                        <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tight mb-2">Live Chat</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Connect directly with our 24/7 technical operations command.</p>
                    </div>
                    <button className="w-full py-5 bg-[#21a0b5] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">Start Chat</button>
                </motion.div>
            </div>

            <div className="bg-[#0a111a] p-16 rounded-[4.5rem] text-white overflow-hidden relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
                    <div className="space-y-8">
                        <h4 className="text-4xl font-black uppercase tracking-tighter">Emergency <span className="text-[#21a0b5]">Recovery</span></h4>
                        <div className="space-y-6">
                            <div className="flex gap-6 items-center">
                                <span className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">📞</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Toll Free Helpline</p>
                                    <p className="text-xl font-black italic">1800-419-FLEET</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-center">
                                <span className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">📧</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Critical Response Email</p>
                                    <p className="text-xl font-black italic">sos@fleetpulse.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 space-y-6">
                        <h5 className="text-sm font-black uppercase tracking-widest border-b border-white/10 pb-4">Recent FAQ Sync</h5>
                        <ul className="space-y-4">
                            {[
                                'How to calibrate GPS fuel sensors?',
                                'Managing cross-border geofencing alerts',
                                'Bulk vehicle CSV upload format',
                                'Resetting MQTT device protocols'
                            ].map((q, i) => (
                                <li key={i} className="text-xs font-bold text-gray-400 hover:text-[#21a0b5] transition-all cursor-pointer flex gap-4">
                                    <span className="text-emerald-500">→</span> {q}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-20 opacity-5 text-[20rem] font-black italic select-none">SOS</div>
            </div>
        </div>
    );
};

export default SupportPage;
