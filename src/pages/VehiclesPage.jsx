import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editVehicleId, setEditVehicleId] = useState(null);

    // Search and Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const [formData, setFormData] = useState({
        plateNumber: '',
        model: '',
        deviceId: '', // Unique GPS Hardware ID
        type: 'Truck',
        status: 'Stopped',
        fuelLevel: 100,
        currentSpeed: 0,
        driverName: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchVehicles = async () => {
        setIsFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setVehicles(data.vehicles);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleOpenAddModal = () => {
        setFormData({ plateNumber: '', model: '', deviceId: '', type: 'Truck', status: 'Stopped', fuelLevel: 100, currentSpeed: 0, driverName: '' });
        setIsEditing(false);
        setEditVehicleId(null);
        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const handleEditClick = (v) => {
        setFormData({
            plateNumber: v.plateNumber,
            model: v.model,
            deviceId: v.deviceId || '',
            type: v.type,
            status: v.status,
            fuelLevel: v.fuelLevel,
            currentSpeed: v.currentSpeed,
            driverName: v.driverName || ''
        });
        setIsEditing(true);
        setEditVehicleId(v._id);
        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const handleSaveVehicle = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = isEditing
                ? `${API_BASE_URL}/api/v1/vehicles/${editVehicleId}`
                : `${API_BASE_URL}/api/v1/vehicles`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: isEditing ? 'Vehicle updated!' : 'Vehicle added!' });
                setTimeout(() => {
                    setShowModal(false);
                    fetchVehicles();
                }, 1000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Action failed.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error connecting to server.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/vehicles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) fetchVehicles();
        } catch (err) {
            alert('Error deleting vehicle');
        }
    };

    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || v.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        const matchesType = typeFilter === 'All' || v.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const stats = [
        { label: 'Total Fleet', value: vehicles.length, icon: '🚛', color: 'bg-blue-50' },
        { label: 'On Road', value: vehicles.filter(v => v.status === 'Moving').length, icon: '⚡', color: 'bg-emerald-50' },
        { label: 'Maintenance', value: vehicles.filter(v => v.status === 'Maintenance').length, icon: '🔧', color: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* Header section */}
            <div className="text-center space-y-3 py-4 relative">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    Vehicle <span className="text-[#21a0b5]">List</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.4em] text-[10px] md:text-xs">Manage all company vehicles and assets</p>
                <div className="w-16 md:w-24 h-1 md:h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-4"></div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                {stats.map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white border border-gray-100 p-4 md:p-8 rounded-[1.5rem] md:rounded-2xl shadow-sm flex flex-row items-center justify-between gap-2">
                        <div>
                            <p className="text-[11px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest text-gray-400 mb-1 leading-none">{s.label}</p>
                            <h3 className="text-xl md:text-4xl font-black text-gray-900">{s.value}</h3>
                        </div>
                        <div className={`text-lg md:text-4xl p-2 md:p-5 ${s.color} rounded-xl md:rounded-2xl shrink-0`}>{s.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
                <div className="flex-1 relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text" placeholder="Search by plate or model..."
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-gray-50 text-sm font-bold border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none transition-all text-gray-900 placeholder:text-gray-300"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <select className="flex-1 md:flex-none bg-gray-50 border-none ring-1 ring-gray-100 px-4 py-4 md:py-3 rounded-xl text-xs font-black text-gray-700 outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Moving">Moving</option>
                        <option value="Stopped">Stopped</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Idle">Idle</option>
                    </select>
                    <button onClick={handleOpenAddModal} className="grow md:grow-0 bg-[#21a0b5] text-white px-6 md:px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a8396] shadow-lg shadow-[#21a0b5]/20 transition-all">
                        ➕ Add
                    </button>
                </div>
            </div>

            {/* Vehicle Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicle Details</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Fuel & Speed</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isFetching ? (
                            <tr><td colSpan="5" className="py-20 text-center text-sm text-gray-400 font-bold italic">Loading fleet database...</td></tr>
                        ) : filteredVehicles.length === 0 ? (
                            <tr><td colSpan="5" className="py-20 text-center text-sm text-gray-400 font-bold italic">No vehicles found.</td></tr>
                        ) : filteredVehicles.map((v) => (
                            <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{v.plateNumber}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{v.model}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black tracking-widest uppercase text-gray-500">{v.type}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${v.status === 'Moving' ? 'bg-emerald-500 animate-pulse' : v.status === 'Stopped' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{v.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[10px] font-black text-gray-800">⛽ {v.fuelLevel}%</p>
                                        <p className="text-[10px] font-black text-[#21a0b5]">⚡ {v.currentSpeed} km/h</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <button onClick={() => handleEditClick(v)} className="text-[#21a0b5] hover:text-gray-900 transition-colors text-[10px] font-black uppercase tracking-widest mr-4">Edit</button>
                                    <button onClick={() => handleDeleteVehicle(v._id)} className="text-gray-300 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="bg-[#21a0b5] p-6 md:p-8 text-white">
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                                    {isEditing ? <>Update <span className="text-black/30">Vehicle</span></> : <>Register <span className="text-black/30">New Asset</span></>}
                                </h2>
                                <p className="text-[9px] opacity-80 uppercase mt-1 font-black tracking-widest">Digital Documentation & Fleet Integration</p>
                            </div>

                            <form onSubmit={handleSaveVehicle} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                {message.text && (
                                    <div className={`p-4 rounded-xl text-[10px] font-black text-center uppercase border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Plate Number</label>
                                        <input
                                            type="text" required
                                            value={formData.plateNumber}
                                            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                            placeholder="HR-26-XX-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vehicle Model</label>
                                        <input
                                            type="text" required
                                            value={formData.model}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                            placeholder="e.g. Tata Prima"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vehicle Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-black text-gray-900 cursor-pointer"
                                        >
                                            <option value="Truck">Truck</option>
                                            <option value="Van">Van</option>
                                            <option value="Car">Car</option>
                                            <option value="Bike">Bike</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-black text-gray-900 cursor-pointer"
                                        >
                                            <option value="Moving">Moving</option>
                                            <option value="Stopped">Stopped</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Idle">Idle</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#21a0b5] ml-1">GPS Device ID (Unique Number)</label>
                                    <input
                                        type="text"
                                        value={formData.deviceId}
                                        onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                        placeholder="e.g. IMEI-864XXXXXXXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Assigned Driver</label>
                                    <input
                                        type="text"
                                        value={formData.driverName}
                                        onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                        placeholder="Name of the driver"
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Discard</button>
                                    <button disabled={isLoading} className="flex-[2] bg-[#21a0b5] text-white py-4 rounded-2xl font-black tracking-widest uppercase text-xs shadow-lg shadow-[#21a0b5]/20 hover:bg-[#1a8396] transition-all transform active:scale-95">
                                        {isLoading ? 'Wait...' : (isEditing ? 'Save Changes' : 'Add to Fleet')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VehiclesPage;
