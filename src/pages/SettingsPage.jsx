import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Profile');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const tabs = [
        { name: 'Profile', icon: '👤', desc: 'Manage your personal identity' },
        { name: 'System', icon: '⚙️', desc: 'Global fleet configuration' },
        { name: 'Notifications', icon: '🔔', desc: 'Tailor your alert experience' },
        { name: 'Security', icon: '🛡️', desc: 'Access tokens and encryption' },
        { name: 'API Sync', icon: '🔌', desc: 'Webhook and IoT integrations' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-4 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-gray-900 tracking-tighter uppercase">
                    Pulse <span className="text-[#21a0b5]">Settings</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Configure your platform experience</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation */}
                <div className="lg:col-span-4 space-y-4">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            whileHover={{ x: 10 }}
                            className={`w-full p-8 rounded-3xl border text-left transition-all flex items-center gap-6 ${activeTab === tab.name
                                ? 'bg-white border-[#21a0b5] shadow-xl shadow-[#21a0b5]/5 lg:relative lg:-right-6 lg:z-10'
                                : 'bg-transparent border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            <span className="text-3xl">{tab.icon}</span>
                            <div>
                                <h4 className="font-black uppercase tracking-tight text-gray-900">{tab.name}</h4>
                                <p className="text-[10px] font-bold uppercase text-gray-400 mt-1">{tab.desc}</p>
                            </div>
                        </motion.button>
                    ))}

                    <div className="bg-[#0a111a] p-10 rounded-[3rem] text-white mt-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#21a0b5] mb-2">Instance Status</p>
                        <h5 className="text-2xl font-black mb-6">Production v2.10</h5>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500">
                                <span>Latency</span>
                                <span className="text-emerald-500">12ms</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500">
                                <span>DB Health</span>
                                <span className="text-emerald-500">Optimal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm min-h-[600px]">
                    {activeTab === 'Profile' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div className="flex items-center gap-10 border-b border-gray-50 pb-10">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#21a0b5] to-[#1a8091] flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                                    {user.name?.charAt(0) || 'A'}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{user.name || 'Admin'}</h3>
                                    <p className="text-sm font-bold text-gray-400 uppercase italic">System {user.role || 'SuperAdmin'}</p>
                                    <button className="text-[10px] font-black uppercase text-[#21a0b5] hover:underline mt-4">Change Avatar</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                                    <input type="text" defaultValue={user.name} className="w-full bg-gray-50 p-5 rounded-2xl text-sm font-bold border-none ring-1 ring-gray-100 outline-none focus:ring-2 focus:ring-[#21a0b5]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email ID</label>
                                    <input type="email" defaultValue={user.email} className="w-full bg-gray-50 p-5 rounded-2xl text-sm font-bold border-none ring-1 ring-gray-100 outline-none focus:ring-2 focus:ring-[#21a0b5]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Organization</label>
                                <input type="text" defaultValue="FleetPulse Logistics Pvt Ltd" className="w-full bg-gray-50 p-5 rounded-2xl text-sm font-bold border-none ring-1 ring-gray-100 outline-none focus:ring-2 focus:ring-[#21a0b5]" />
                            </div>

                            <div className="pt-10 flex gap-4">
                                <button className="bg-[#21a0b5] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#21a0b5]/20 hover:bg-[#1c8a9c] transition-all">Save Profile Changes</button>
                                <button className="bg-red-50 text-red-500 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Deactivate Account</button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'System' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 text-center py-20">
                            <span className="text-6xl">🛠️</span>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">System Calibration</h3>
                                <p className="text-gray-400 font-bold uppercase text-[10px] mt-2">Adjust unit measurements and map providers</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab !== 'Profile' && activeTab !== 'System' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-3xl">🧩</div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-300">Section details incoming in next sync</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
