import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Component to handle map center changes
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const LiveMapPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setVehicles(data.vehicles);
                // If a vehicle is selected, update its data from the fresh list
                if (selectedVehicle) {
                    const updated = data.vehicles.find(v => v._id === selectedVehicle._id);
                    if (updated) setSelectedVehicle(updated);
                } else if (data.vehicles.length > 0) {
                    setSelectedVehicle(data.vehicles[0]);
                }
            }
        } catch (err) {
            console.error('GPS Data fetch failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
        const interval = setInterval(fetchVehicles, 5000); // Fast updates for Live tracking
        return () => clearInterval(interval);
    }, [selectedVehicle?._id]);

    const defaultCenter = [28.6139, 77.2090]; // Delhi

    return (
        <div className="space-y-6 pb-20">
            {/* Header section */}
            <div className="text-center space-y-4 py-4 relative">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase"
                >
                    Live <span className="text-[#21a0b5]">Map</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.4em] text-[10px] md:text-xs">See where your vehicles are right now</p>
                <div className="w-16 md:w-24 h-1 md:h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-4"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-screen lg:h-[750px]">

                {/* 1. Vehicle List Sidebar */}
                <div className="w-full lg:w-96 h-1/2 lg:h-full bg-white border border-gray-100 rounded-[2.5rem] flex flex-col shadow-sm overflow-hidden shrink-0">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center justify-between">
                            Active Assets
                            <span className="bg-[#21a0b5]/10 text-[#21a0b5] px-3 py-1 rounded-full text-[9px] font-black uppercase">
                                {vehicles.length} Devices
                            </span>
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {isLoading && <div className="p-10 text-center text-xs text-gray-400 font-bold uppercase animate-pulse">Scanning Satellites...</div>}

                        {vehicles.map((v) => (
                            <motion.div
                                key={v._id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedVehicle(v)}
                                className={`p-5 rounded-[1.5rem] border transition-all cursor-pointer group ${selectedVehicle?._id === v._id
                                    ? 'bg-[#21a0b5] border-[#21a0b5] shadow-lg shadow-[#21a0b5]/20'
                                    : 'bg-white border-gray-100 hover:border-[#21a0b5]/30 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className={`text-xs font-black uppercase tracking-tight ${selectedVehicle?._id === v._id ? 'text-white' : 'text-gray-900'}`}>
                                        {v.plateNumber}
                                    </p>
                                    <div className={`w-2 h-2 rounded-full ${v.status === 'Moving' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-[10px] font-bold uppercase ${selectedVehicle?._id === v._id ? 'text-white/70' : 'text-gray-400'}`}>
                                        {v.deviceId || 'No GPS ID'}
                                    </p>
                                    <p className={`text-[10px] font-black ${selectedVehicle?._id === v._id ? 'text-white' : 'text-[#21a0b5]'}`}>
                                        {v.currentSpeed} km/h
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 2. Main Map Tracking Area */}
                <div className="flex-1 rounded-[3rem] border border-gray-100 overflow-hidden relative shadow-2xl bg-gray-100">

                    <MapContainer
                        center={selectedVehicle ? [selectedVehicle.latitude, selectedVehicle.longitude] : defaultCenter}
                        zoom={13}
                        className="w-full h-full z-10"
                        zoomControl={false}
                    >
                        {/* Use CartoDB Dark Matter for a premium dark look */}
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {selectedVehicle && <ChangeView center={[selectedVehicle.latitude, selectedVehicle.longitude]} zoom={15} />}

                        {vehicles.map((v) => (
                            <Marker
                                key={v._id}
                                position={[v.latitude, v.longitude]}
                                eventHandlers={{
                                    click: () => setSelectedVehicle(v),
                                }}
                            >
                                <Popup>
                                    <div className="p-2 font-bold text-xs uppercase">
                                        <p className="text-[#21a0b5]">{v.plateNumber}</p>
                                        <p className="text-gray-500 mt-1">{v.driverName}</p>
                                        <p className="border-t mt-2 pt-2">{v.currentSpeed} KM/H</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Telemetry Overlay Card */}
                    {selectedVehicle && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 bg-white/90 backdrop-blur-xl border border-white/20 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl z-20 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6"
                        >
                            <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-12">
                                <div>
                                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Driver</p>
                                    <p className="text-sm md:text-xl font-black text-gray-900">{selectedVehicle.driverName || 'N/A'}</p>
                                </div>
                                <div className="hidden md:block h-12 w-[1px] bg-gray-200/50"></div>
                                <div>
                                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fuel</p>
                                    <p className="text-sm md:text-xl font-black text-gray-900">{selectedVehicle.fuelLevel}%</p>
                                </div>
                                <div className="hidden md:block h-12 w-[1px] bg-gray-200/50"></div>
                                <div>
                                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Speed</p>
                                    <p className="text-sm md:text-xl font-black text-[#21a0b5]">{selectedVehicle.currentSpeed} KM/H</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 md:flex-none bg-gray-100 text-gray-600 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">History</button>
                                <button className="flex-1 md:flex-none bg-[#21a0b5] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all">Video</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Map UI Controls */}
                    <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
                        <button className="w-14 h-14 bg-white border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-xl hover:bg-gray-50 transition-all">📡</button>
                        <button className="w-14 h-14 bg-white border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-xl hover:bg-gray-50 transition-all">🏗️</button>
                    </div>

                    {/* Searching Satellites Overlay if loading */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-[#21a0b5]/20 border border-[#21a0b5]/50 rounded-full flex items-center justify-center animate-ping mb-4 mx-auto">
                                    <div className="w-4 h-4 bg-[#21a0b5] rounded-full"></div>
                                </div>
                                <p className="text-[#21a0b5] font-black uppercase tracking-[0.5em] text-xs">Syncing Satellites...</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LiveMapPage;
