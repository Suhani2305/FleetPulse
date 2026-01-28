import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090, // Delhi
};

// Premium Dark Mode Style for Google Maps
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#0a111a" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0a111a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#21a0b5" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0d1a26" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#2d5a27" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c2c3e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1c2c3e" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#21a0b5", opacity: 0.1 }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#21a0b5", weight: 0.1 }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#21a0b5" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1c2c3e" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#21a0b5" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#05090f" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#05090f" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#05090f" }] },
];

const LiveMapPage = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['drawing']
    });

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [map, setMap] = useState(null);
    const socketRef = useRef(null);

    // Initial Fetch
    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setVehicles(data.vehicles);
                if (data.vehicles.length > 0 && !selectedVehicle) {
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

        // 🔌 Connect Socket.io
        socketRef.current = io(API_BASE_URL);

        socketRef.current.on('connect', () => {
            console.log('✅ Real-time Link established');
        });

        // 🚛 Handle Live Updates
        socketRef.current.on('vehicle-update', (updatedVehicle) => {
            console.log('📡 Live Update:', updatedVehicle.plateNumber);

            setVehicles(prev => prev.map(v =>
                v._id === updatedVehicle._id ? { ...v, ...updatedVehicle } : v
            ));

            // Update selected vehicle data if it was the one updated
            setSelectedVehicle(prev => {
                if (prev && prev._id === updatedVehicle._id) {
                    return { ...prev, ...updatedVehicle };
                }
                return prev;
            });
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    const onLoad = useCallback(function callback(m) {
        setMap(m);
    }, []);

    const onUnmount = useCallback(function callback(m) {
        setMap(null);
    }, []);

    // Pan to selected vehicle only when explicitly selected or significant move
    useEffect(() => {
        if (map && selectedVehicle) {
            map.panTo({
                lat: selectedVehicle.latitude,
                lng: selectedVehicle.longitude
            });
        }
    }, [selectedVehicle?._id, map]); // Only pan on initial selection of ID

    if (loadError) {
        return <div className="p-20 text-center text-red-500 font-bold">Error loading Google Maps. Check your API Key.</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header section */}
            <div className="text-center space-y-3 py-4 relative">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase"
                >
                    Live <span className="text-[#21a0b5]">Map</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-xs">Real-time Satellite Fleet Tracking</p>
                <div className="w-12 md:w-16 h-1 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-3"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-screen lg:h-[750px]">

                {/* 1. Vehicle List Sidebar */}
                <div className="w-full lg:w-96 h-1/2 lg:h-full bg-white border border-gray-100 rounded-[2.5rem] flex flex-col shadow-sm overflow-hidden shrink-0">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center justify-between">
                            Active Assets
                            <span className="bg-[#21a0b5]/10 text-[#21a0b5] px-3 py-1 rounded-full text-[9px] font-black uppercase">
                                {vehicles.length} Nodes
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
                <div className="flex-1 rounded-[3rem] border border-gray-100 overflow-hidden relative shadow-2xl bg-[#0a111a]">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={selectedVehicle ? { lat: selectedVehicle.latitude, lng: selectedVehicle.longitude } : defaultCenter}
                            zoom={13}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{
                                styles: darkMapStyle,
                                disableDefaultUI: true,
                                zoomControl: false,
                                mapTypeControl: false,
                                streetViewControl: false,
                                fullscreenControl: false
                            }}
                        >
                            {vehicles.map((v) => (
                                <Marker
                                    key={v._id}
                                    position={{ lat: v.latitude, lng: v.longitude }}
                                    onClick={() => setSelectedVehicle(v)}
                                    icon={{
                                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                                        fillColor: selectedVehicle?._id === v._id ? "#21a0b5" : "#4b5563",
                                        fillOpacity: 1,
                                        strokeWeight: 2,
                                        strokeColor: "#ffffff",
                                        scale: 2,
                                        anchor: isLoaded ? new window.google.maps.Point(12, 24) : null
                                    }}
                                />
                            ))}

                            {selectedVehicle && (
                                <InfoWindow
                                    position={{ lat: selectedVehicle.latitude, lng: selectedVehicle.longitude }}
                                    onCloseClick={() => setSelectedVehicle(null)}
                                >
                                    <div className="p-1 min-w-[120px]">
                                        <p className="font-black text-[10px] uppercase text-[#21a0b5]">{selectedVehicle.plateNumber}</p>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase">{selectedVehicle.driverName}</p>
                                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-900">{selectedVehicle.currentSpeed} KM/H</span>
                                            <span className={`w-2 h-2 rounded-full ${selectedVehicle.status === 'Moving' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0a111a]">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-[#21a0b5]/20 border border-[#21a0b5]/50 rounded-full flex items-center justify-center animate-ping mb-4 mx-auto">
                                    <div className="w-4 h-4 bg-[#21a0b5] rounded-full"></div>
                                </div>
                                <p className="text-[#21a0b5] font-black uppercase tracking-[0.5em] text-xs">Syncing Real-time Feed...</p>
                            </div>
                        </div>
                    )}

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
                </div>
            </div>
        </div>
    );
};

export default LiveMapPage;
