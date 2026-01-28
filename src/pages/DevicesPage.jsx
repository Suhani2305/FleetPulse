import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const DevicesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [devices, setDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [commandLoading, setCommandLoading] = useState(null);
    const [showModal, setShowModal] = useState(null); // { type: 'kill' | 'edit', device: object }
    const [editData, setEditData] = useState({ deviceId: '', plateNumber: '', type: '' });
    const socketRef = useRef(null);

    const fetchDevices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                const vehicleDevices = data.vehicles.filter(v => v.deviceId);
                setDevices(vehicleDevices);
            }
        } catch (err) {
            console.error('Error fetching devices:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        socketRef.current = io(API_BASE_URL);
        socketRef.current.on('vehicle-update', (updatedVehicle) => {
            setDevices(prev => prev.map(d =>
                d._id === updatedVehicle._id ? { ...d, ...updatedVehicle } : d
            ));
        });
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    const handleImmobilizer = async (device) => {
        const newStatus = device.engineStatus === 'BLOCKED' ? 'ON' : 'BLOCKED';
        setCommandLoading(device._id);
        setShowModal(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/vehicles/${device._id}/immobilizer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (!data.success) throw new Error();
        } catch (err) {
            console.error('Command failed');
        } finally {
            setCommandLoading(null);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setCommandLoading(showModal.device._id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/v1/vehicles/${showModal.device._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData)
            });
            const data = await res.json();
            if (data.success) {
                setDevices(prev => prev.map(d => d._id === data.vehicle._id ? data.vehicle : d));
                setShowModal(null);
            }
        } catch (err) {
            console.error('Edit failed');
        } finally {
            setCommandLoading(null);
        }
    };

    const filteredDevices = devices.filter(d =>
        d.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Network Active', value: devices.length, icon: '🛰️', color: 'text-blue-500' },
        { label: 'Immobilized', value: devices.filter(d => d.engineStatus === 'BLOCKED').length, icon: '🛡️', color: 'text-red-500' },
        { label: 'Avg Signal', value: '98%', icon: '📶', color: 'text-emerald-500' },
        { label: 'Power Loss', value: devices.filter(d => d.internalBattery < 30).length, icon: '⚡', color: 'text-amber-500' },
    ];

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Header section (Unified Live Map Style) */}
            <div className="text-center space-y-3 py-6 relative">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1 bg-[#21a0b5]/10 rounded-full">
                    <span className="text-[9px] font-black text-[#21a0b5] uppercase tracking-[0.2em]">GPS Hardware Management</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none"
                >
                    Device <span className="text-[#21a0b5]">Control</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] md:text-[10px]">
                    Manage real-time telemetry hardware and mobilization
                </p>
                <div className="w-12 md:w-16 h-1 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-3"></div>
            </div>

            {/* Device Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-5 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 leading-none mb-2">{s.label}</p>
                            <h4 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{s.value}</h4>
                        </div>
                        <div className={`text-2xl p-4 bg-gray-50 rounded-2xl ${s.color}`}>{s.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden mt-6">
                <div className="p-6 md:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 bg-gray-50/10">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="IMEI, Plate, or Protocol..."
                            className="w-full pl-14 pr-8 py-4 bg-white rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] transition-all outline-none text-sm font-bold shadow-sm placeholder:text-gray-400 placeholder:font-black text-gray-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Signal & Satellites</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Power Source</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Engine State</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="5" className="py-20 text-center text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">Syncing satellite uplink...</td></tr>
                            ) : filteredDevices.map((d) => (
                                <tr key={d._id} className="group hover:bg-gray-50/30 transition-all">
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${d.status === 'Moving' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'}`}>
                                                {d.type?.[0] || 'T'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{d.deviceId}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{d.plateNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(b => (
                                                        <div key={b} className={`w-1 h-3 rounded-full ${b <= Math.ceil((d.gsmSignal || 80) / 20) ? 'bg-emerald-500' : 'bg-gray-100'}`}></div>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-black text-gray-600">{(d.gsmSignal || 85)}% GSM</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                                <span>🛰️ {(d.satellites || 12)} Satellites Locked</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#21a0b5] rounded-full" style={{ width: `${d.internalBattery || 90}%` }}></div>
                                                </div>
                                                <span className="text-[9px] font-black text-gray-600">INT: {d.internalBattery || 90}%</span>
                                            </div>
                                            <p className="text-[9px] font-bold text-blue-500 uppercase">Vehicle Power: Active</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full ${d.engineStatus === 'BLOCKED' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${d.engineStatus === 'BLOCKED' ? 'bg-red-500 pulse' : 'bg-emerald-500'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{d.engineStatus === 'BLOCKED' ? 'Immobilized' : 'Authorized'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setShowModal({ type: 'kill', device: d })}
                                                disabled={commandLoading === d._id}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${d.engineStatus === 'BLOCKED'
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                    : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                    } ${commandLoading === d._id ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
                                            >
                                                {commandLoading === d._id ? 'Sending...' : (d.engineStatus === 'BLOCKED' ? 'Restore Engine' : 'Kill Engine')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditData({ deviceId: d.deviceId, plateNumber: d.plateNumber, type: d.type });
                                                    setShowModal({ type: 'edit', device: d });
                                                }}
                                                className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all text-xs"
                                            >
                                                ⚙️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Modals Overlay */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(null)}
                            className="absolute inset-0 bg-white/10 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
                        >
                            {showModal.type === 'kill' ? (
                                <div className="p-10 text-center">
                                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-6 ${showModal.device.engineStatus === 'BLOCKED' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                        {showModal.device.engineStatus === 'BLOCKED' ? '🔓' : '🛑'}
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                                        {showModal.device.engineStatus === 'BLOCKED' ? 'Restore Engine Power' : 'Engine Immobilization'}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-sm mb-8">
                                        {showModal.device.engineStatus === 'BLOCKED'
                                            ? `This will restore engine control to ${showModal.device.plateNumber}. Authorized personnel only.`
                                            : `WARNING: This command will cut off fuel to ${showModal.device.plateNumber} immediately. Use only in theft situations.`
                                        }
                                    </p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setShowModal(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-gray-200 transition-all">Cancel</button>
                                        <button
                                            onClick={() => handleImmobilizer(showModal.device)}
                                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg transition-all ${showModal.device.engineStatus === 'BLOCKED' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-600 shadow-red-200'}`}
                                        >
                                            Confirm Command
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10">
                                    <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight text-center">Update Device Mapping</h3>
                                    <form onSubmit={handleEditSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">GPS IMEI ID</label>
                                            <input
                                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900"
                                                value={editData.deviceId}
                                                onChange={(e) => setEditData({ ...editData, deviceId: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Vehicle Plate</label>
                                            <input
                                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none font-bold text-sm text-gray-900"
                                                value={editData.plateNumber}
                                                onChange={(e) => setEditData({ ...editData, plateNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-4 mt-8">
                                            <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-600">Cancel</button>
                                            <button type="submit" className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gray-200">Save Changes</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DevicesPage;
