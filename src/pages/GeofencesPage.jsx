import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, DrawingManager, Polygon, Circle } from '@react-google-maps/api';
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

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#0a111a" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0a111a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c2c3e" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#05090f" }] },
];

const GeofencesPage = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['drawing']
    });

    const [geofences, setGeofences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [map, setMap] = useState(null);
    const [selectedGeofence, setSelectedGeofence] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showEditCard, setShowEditCard] = useState(false);
    const [newGeofenceData, setNewGeofenceData] = useState({
        name: '',
        type: 'Polygon',
        coordinates: [],
        center: null,
        radius: 0,
        color: '#21a0b5',
        alerts: ['Enter', 'Exit']
    });

    const fetchGeofences = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/geofences`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setGeofences(data.geofences);
            }
        } catch (err) {
            console.error('Geofences fetch failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGeofences();

        const socket = io(API_BASE_URL);

        socket.on('geofence-update', (data) => {
            if (data.type === 'CREATE') {
                setGeofences(prev => [...prev, data.geofence]);
            } else if (data.type === 'UPDATE') {
                setGeofences(prev => prev.map(g => g._id === data.geofence._id ? data.geofence : g));
            } else if (data.type === 'DELETE') {
                setGeofences(prev => prev.filter(g => g._id !== data.id));
            }
        });

        return () => socket.disconnect();
    }, []);

    const onPolygonComplete = (polygon) => {
        const path = polygon.getPath().getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng()
        }));
        setNewGeofenceData(prev => ({ ...prev, type: 'Polygon', coordinates: path }));
        setShowEditCard(true);
        polygon.setMap(null); // Remove the drawn polygon as we will render it from state
    };

    const onCircleComplete = (circle) => {
        const center = { lat: circle.getCenter().lat(), lng: circle.getCenter().lng() };
        const radius = circle.getRadius();
        setNewGeofenceData(prev => ({ ...prev, type: 'Circle', center, radius }));
        setShowEditCard(true);
        circle.setMap(null);
    };

    const handleSaveGeofence = async () => {
        if (!newGeofenceData.name.trim()) {
            alert('Please enter a name for the zone before saving.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/geofences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newGeofenceData)
            });
            const data = await response.json();
            if (data.success) {
                alert('Geofence saved successfully!');
                fetchGeofences();
                setShowEditCard(false);
                setNewGeofenceData({
                    name: '',
                    type: 'Polygon',
                    coordinates: [],
                    center: null,
                    radius: 0,
                    color: '#21a0b5',
                    alerts: ['Enter', 'Exit']
                });
            } else {
                alert(`Save failed: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Save failed:', err);
            alert(`Save failed: ${err.message}`);
        }
    };

    const handleDeleteGeofence = async (id) => {
        if (!window.confirm('Are you sure you want to delete this geofence?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/geofences/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchGeofences();
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    if (loadError) return <div className="p-20 text-center text-red-500 font-bold">Error loading Maps</div>;

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Header section */}
            <div className="text-center space-y-3 py-6 relative">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none"
                >
                    Virtual <span className="text-[#21a0b5]">Boundaries</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] md:text-[10px]">
                    Define and manage dynamic exclusion zones and corridors
                </p>
                <div className="w-12 md:w-16 h-1 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-3"></div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center mb-10">
                <button
                    onClick={() => {
                        const mapElement = document.getElementById('geofence-map-container');
                        if (mapElement) mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#21a0b5] transition-all flex items-center gap-2 active:scale-95"
                >
                    🗺️ Start Tracing Zone
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                {/* List of Geofences */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-8 pb-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Saved Geofences</h4>
                            <span className="text-[10px] font-black text-[#21a0b5] bg-[#21a0b5]/10 px-2 py-0.5 rounded-md">{geofences.length}</span>
                        </div>
                        <div className="space-y-2 p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-10 text-center animate-pulse text-gray-300 font-black uppercase tracking-widest text-[10px]">Fetching zones...</div>
                            ) : geofences.length > 0 ? (
                                geofences.map((g) => (
                                    <motion.div
                                        key={g._id}
                                        whileHover={{ x: 5 }}
                                        onClick={() => {
                                            setSelectedGeofence(g);
                                            if (map) {
                                                const center = g.type === 'Circle' ? g.center : g.coordinates[0];
                                                map.panTo(center);
                                            }
                                        }}
                                        className={`p-6 rounded-2xl transition-all cursor-pointer border ${selectedGeofence?._id === g._id ? 'bg-[#21a0b5]/5 border-[#21a0b5]/20' : 'hover:bg-gray-50 border-transparent hover:border-gray-100'} group`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: g.color }}></div>
                                                <h5 className="font-black text-gray-900 uppercase tracking-tight">{g.name}</h5>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteGeofence(g._id); }}
                                                className="text-[9px] font-black text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{g.type}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">🔔 {g.alerts.join('/')}</span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No geofences found</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Map Interface */}
                <div id="geofence-map-container" className="lg:col-span-8 bg-white border border-gray-100 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative shadow-sm h-[600px] md:h-[800px]">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={defaultCenter}
                            zoom={12}
                            onLoad={setMap}
                            options={{
                                styles: darkMapStyle,
                                disableDefaultUI: true,
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false
                            }}
                        >
                            <DrawingManager
                                onPolygonComplete={onPolygonComplete}
                                onCircleComplete={onCircleComplete}
                                options={{
                                    drawingControl: true,
                                    drawingControlOptions: {
                                        position: window.google.maps.ControlPosition.TOP_CENTER,
                                        drawingModes: [
                                            window.google.maps.drawing.OverlayType.POLYGON,
                                            window.google.maps.drawing.OverlayType.CIRCLE,
                                        ],
                                    },
                                    polygonOptions: {
                                        fillColor: '#21a0b5',
                                        fillOpacity: 0.3,
                                        strokeWeight: 2,
                                        clickable: true,
                                        editable: true,
                                        zIndex: 1,
                                    },
                                    circleOptions: {
                                        fillColor: '#21a0b5',
                                        fillOpacity: 0.3,
                                        strokeWeight: 2,
                                        clickable: true,
                                        editable: true,
                                        zIndex: 1,
                                    }
                                }}
                            />

                            {geofences.map(g => (
                                g.type === 'Polygon' ? (
                                    <Polygon
                                        key={g._id}
                                        paths={g.coordinates}
                                        options={{
                                            fillColor: g.color || '#21a0b5',
                                            fillOpacity: 0.2,
                                            strokeColor: g.color || '#21a0b5',
                                            strokeOpacity: 1,
                                            strokeWeight: 2,
                                        }}
                                    />
                                ) : (
                                    <Circle
                                        key={g._id}
                                        center={g.center}
                                        radius={g.radius}
                                        options={{
                                            fillColor: g.color || '#21a0b5',
                                            fillOpacity: 0.2,
                                            strokeColor: g.color || '#21a0b5',
                                            strokeOpacity: 1,
                                            strokeWeight: 2,
                                        }}
                                    />
                                )
                            ))}
                        </GoogleMap>
                    ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <div className="text-gray-300 font-black uppercase tracking-widest animate-pulse">Initializing Neural Map...</div>
                        </div>
                    )}

                    {/* Zone Edit Overlay - Sleeker Side Panel Style */}
                    <AnimatePresence>
                        {showEditCard && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="absolute top-6 right-6 bottom-6 w-80 md:w-96 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2rem] p-8 z-[200] flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-lg font-black uppercase text-gray-900 tracking-tight">Zone Identity</h3>
                                    <button onClick={() => setShowEditCard(false)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-black hover:bg-gray-200 transition-colors">✕</button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Boundary Label</label>
                                        <input
                                            type="text"
                                            value={newGeofenceData.name}
                                            onChange={(e) => setNewGeofenceData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="e.g. Forbidden Area"
                                            className="w-full bg-gray-50 p-5 rounded-2xl text-sm font-black text-gray-900 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#21a0b5] transition-all placeholder:text-gray-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Zone Visuals</label>
                                        <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                                            {['#21a0b5', '#10b981', '#ef4444', '#f59e0b', '#6366f1'].map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setNewGeofenceData(prev => ({ ...prev, color: c }))}
                                                    className={`flex-1 h-10 rounded-xl transition-all ${newGeofenceData.color === c ? 'scale-90 shadow-inner brightness-90' : 'hover:scale-105'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-[#21a0b5]/5 p-6 rounded-3xl border border-[#21a0b5]/10">
                                        <p className="text-[9px] font-black text-[#21a0b5] uppercase mb-1">Status</p>
                                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">You are currently defining a <span className="text-[#21a0b5] uppercase">{newGeofenceData.type}</span>. All fleet vehicles will trigger alerts upon {newGeofenceData.alerts.join(' & ')}.</p>
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-3">
                                    <button onClick={() => setShowEditCard(false)} className="flex-1 bg-gray-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all">Discard</button>
                                    <button onClick={handleSaveGeofence} className="flex-[2] bg-[#21a0b5] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#21a0b5]/20 hover:scale-105 transition-all active:scale-95">Save Traced Zone</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default GeofencesPage;
