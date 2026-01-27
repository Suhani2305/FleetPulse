import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SchedulerPage = () => {
    const schedules = [
        { id: 1, vehicle: 'HR-26-CZ-9021', timeSlot: '22:00 - 06:00', zone: 'Sector 14 Parking', alerts: 'No Movement', status: 'Scheduled' },
        { id: 2, vehicle: 'DL-01-BK-5521', timeSlot: '20:00 - 08:00', zone: 'Warehouse A', alerts: 'Door Open', status: 'Active' },
        { id: 3, vehicle: 'UP-14-XY-7732', timeSlot: '23:00 - 05:00', zone: 'Private Yard', alerts: 'Vibration', status: 'Standby' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Parked <span className="text-[#21a0b5]">Scheduler</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Define expected idle slots and security triggers</p>
                </div>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#21a0b5] transition-all">
                    ➕ New Park Slot
                </button>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Security Slots</h4>
                    <span className="text-[9px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase">12 Assets Secured</span>
                </div>
                {schedules.map((s, i) => (
                    <motion.div key={i} className="p-10 border-b last:border-none border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-10">
                            <div className="text-4xl">🅿️</div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{s.vehicle}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.zone}</p>
                            </div>
                        </div>
                        <div className="flex gap-20 items-center">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Time Range</p>
                                <p className="text-sm font-black text-gray-900 tracking-widest">{s.timeSlot}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Alert Trigger</p>
                                <span className="text-[9px] bg-red-50 text-red-500 px-3 py-1 rounded-md font-black uppercase">{s.alerts}</span>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-200'}`}></div>
                            <button className="h-12 w-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#21a0b5] group-hover:text-white transition-all">✏️</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#21a0b5] p-12 rounded-[4rem] text-white overflow-hidden relative">
                    <div className="relative z-10">
                        <h4 className="text-3xl font-black uppercase tracking-tighter mb-4">Theft Prevention</h4>
                        <p className="text-sm font-bold opacity-80 leading-relaxed uppercase">Automatic engine immobilization during scheduled parking hours if ignition is detected.</p>
                        <button className="mt-8 bg-white text-[#21a0b5] px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Configure Lock</button>
                    </div>
                </div>
                <div className="bg-gray-900 p-12 rounded-[4rem] text-white flex flex-col justify-center">
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Battery Saving</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">Devices enter deep sleep during long park schedules to conserve hardware health.</p>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#21a0b5] w-3/4"></div>
                    </div>
                    <p className="text-[9px] font-black text-emerald-400 uppercase mt-2">75% Energy Efficiency</p>
                </div>
            </div>
        </div>
    );
};

export default SchedulerPage;
