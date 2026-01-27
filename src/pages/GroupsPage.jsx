import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GroupsPage = () => {
    const groups = [
        { id: 1, name: 'Delhi Main Ops', members: 12, vehicles: 45, permissions: 'All Access', color: 'bg-blue-500' },
        { id: 2, name: 'Mumbai Delivery', members: 8, vehicles: 30, permissions: 'Read/Write', color: 'bg-emerald-500' },
        { id: 3, name: 'Night Shift Team', members: 5, vehicles: 12, permissions: 'Restricted', color: 'bg-amber-500' },
        { id: 4, name: 'Maintenance Crew', members: 15, vehicles: 0, permissions: 'Maintenance Only', color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        User <span className="text-[#21a0b5]">Groups</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Organize users into regional or operational teams</p>
                </div>
                <button className="bg-[#21a0b5] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">
                    ➕ Create New Group
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {groups.map((group, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-8">
                            <div className={`w-20 h-20 rounded-[2rem] ${group.color} text-white flex items-center justify-center text-3xl shadow-xl shadow-current/20`}>
                                📁
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{group.name}</h3>
                                <div className="flex gap-4 mt-2">
                                    <span className="text-[10px] font-black text-[#21a0b5] uppercase tracking-widest">{group.members} Members</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {group.vehicles} Vehicles</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Access Level</p>
                            <p className="text-sm font-black text-gray-900 uppercase">{group.permissions}</p>
                            <button className="mt-4 text-[10px] font-black uppercase text-[#21a0b5] hover:underline">Manage</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-[#0a111a] p-16 rounded-[4rem] text-white">
                <h3 className="text-3xl font-black tracking-tight uppercase mb-8 border-l-4 border-[#21a0b5] pl-6">Hierarchical Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                        <h4 className="text-emerald-400 font-black uppercase tracking-widest text-sm">Inheritance</h4>
                        <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold">Sub-groups automatically inherit permissions from headquarters group nodes.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-blue-400 font-black uppercase tracking-widest text-sm">Asset Linking</h4>
                        <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold">Link specific vehicle ranges to regional groups for localized monitoring.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-amber-400 font-black uppercase tracking-widest text-sm">Audit Trails</h4>
                        <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold">Every group membership change is logged for compliance and security audits.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupsPage;
