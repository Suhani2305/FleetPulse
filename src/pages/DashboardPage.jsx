import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Chart.js registration
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const DashboardPage = () => {
    const [fleetStats, setFleetStats] = useState({ total: 0, active: 0, stopped: 0, maintenance: 0 });
    const [liveVehicles, setLiveVehicles] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Stats
            const statsRes = await fetch(`${API_BASE_URL}/api/v1/vehicles/stats`, { headers });
            const statsData = await statsRes.json();
            if (statsData.success) {
                setFleetStats(statsData.stats);
            }

            // Fetch Live Vehicles
            const vehiclesRes = await fetch(`${API_BASE_URL}/api/v1/vehicles`, { headers });
            const vehiclesData = await vehiclesRes.json();
            if (vehiclesData.success) {
                setLiveVehicles(vehiclesData.vehicles);
            }

        } catch (err) {
            console.error('Data sync failed:', err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // Polling for "Real" update feel
        return () => clearInterval(interval);
    }, []);

    // Chart Data (Simulated curves based on real totals)
    const lineData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
        datasets: [
            {
                label: 'Active Vehicles',
                data: [
                    Math.floor(fleetStats.total * 0.2),
                    Math.floor(fleetStats.total * 0.1),
                    Math.floor(fleetStats.total * 0.8),
                    Math.floor(fleetStats.total * 0.95),
                    Math.floor(fleetStats.total * 0.7),
                    Math.floor(fleetStats.total * 0.5),
                    Math.floor(fleetStats.total * 0.3)
                ],
                borderColor: '#21a0b5',
                backgroundColor: 'rgba(33, 160, 181, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#21a0b5',
            }
        ]
    };

    const doughnutData = {
        labels: ['Moving', 'Stopped', 'Maintenance'],
        datasets: [{
            data: [fleetStats.active, fleetStats.stopped, fleetStats.maintenance],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                ticks: { color: '#9ca3af', font: { size: 10, weight: 'bold' } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 10, weight: 'bold' } }
            }
        }
    };

    const statsCards = [
        { label: 'Total Fleet', value: fleetStats.total, grow: 'Live Nodes', icon: '🚛', color: 'from-blue-500/10 to-blue-600/5' },
        { label: 'Moving Now', value: fleetStats.active, grow: 'On Road', icon: '⚡', color: 'from-emerald-500/10 to-emerald-600/5' },
        { label: 'Maintenance', value: fleetStats.maintenance, grow: 'In Workshop', icon: '🔧', color: 'from-amber-500/10 to-amber-600/5' },
        { label: 'Stopped', value: fleetStats.stopped, grow: 'Parked', icon: '🛑', color: 'from-red-500/10 to-red-600/5' },
    ];

    return (
        <div className="space-y-6 pb-20">

            {/* Header section */}
            <div className="text-center space-y-3 py-4 relative">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase"
                >
                    Fleet <span className="text-[#21a0b5]">Dashboard</span>
                </motion.h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.4em] text-[10px] md:text-xs">Quick summary of your fleet and vehicles</p>
                <div className="w-16 md:w-24 h-1 md:h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-2 md:mt-4"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {statsCards.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-white border border-gray-100 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative shadow-sm group hover:shadow-md transition-all`}
                    >
                        <div className="flex flex-row justify-between items-center md:items-center gap-2">
                            <div>
                                <p className="text-[11px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest text-gray-400 mb-1 leading-none">{s.label}</p>
                                <h3 className="text-xl md:text-4xl font-black text-gray-900 tracking-tighter">{s.value}</h3>
                                <p className="text-[9px] md:text-[10px] font-black mt-1 md:mt-2 uppercase text-[#21a0b5]">{s.grow}</p>
                            </div>
                            <div className="text-lg md:text-3xl p-2 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-500 shrink-0">{s.icon}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <motion.div className="lg:col-span-8 bg-white border border-gray-100 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-8 md:mb-10">
                        <h4 className="text-base md:text-xl font-black text-gray-900 uppercase tracking-tight">Fleet Usage Activity</h4>
                        <div className="flex gap-2">
                            {['24H', 'LIVE'].map(t => (
                                <span key={t} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${t === 'LIVE' ? 'bg-[#21a0b5] text-white shadow-lg shadow-[#21a0b5]/20' : 'bg-gray-50 text-gray-400'}`}>{t}</span>
                            ))}
                        </div>
                    </div>
                    <div className="h-64 md:h-80 w-full">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </motion.div>

                <motion.div className="lg:col-span-4 bg-white border border-gray-100 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-sm">
                    <h4 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight mb-6 md:mb-8">Asset States</h4>
                    <div className="h-48 w-48 md:h-64 md:w-64 relative">
                        <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '75%' }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl md:text-4xl font-black text-gray-900 leading-none">{fleetStats.total}</span>
                            <span className="text-[7px] md:text-[8px] font-black uppercase text-gray-400 tracking-[0.1em] md:tracking-[0.2em] mt-1 md:mt-2 italic">Total Units</span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Real Assets Table */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                        Live Tracking Overview
                        <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{fleetStats.active} Moving</span>
                    </h4>
                    <button onClick={fetchDashboardData} className="text-[10px] font-black uppercase tracking-widest text-[#21a0b5] hover:underline">Manual Sync</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/30">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Plate Number</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Model</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">State</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Speed</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Driver</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {liveVehicles.map((v, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all cursor-pointer group">
                                    <td className="px-8 py-6 text-sm font-black text-gray-800 tracking-tight group-hover:text-[#21a0b5] transition-colors">{v.plateNumber}</td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase">{v.model}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${v.status === 'Moving' ? 'bg-emerald-500 animate-pulse' : v.status === 'Stopped' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{v.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-black text-gray-700">{v.currentSpeed} km/h</td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-400 italic">@{v.driverName || 'Unassigned'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {liveVehicles.length === 0 && <div className="py-20 text-center text-xs text-gray-300 font-bold italic tracking-widest uppercase">Connecting to Fleet Database...</div>}
                </div>
            </div>

            {/* Map Interaction Section */}
            <div className="h-[500px] bg-white border border-gray-100 rounded-[3rem] overflow-hidden relative shadow-sm">
                <img src="/src/assets/dark_fleet_map_mockup.png" className="w-full h-full object-cover opacity-90" alt="Fleet Map" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>

                <div className="absolute bottom-10 left-10 right-10">
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 p-8 rounded-[2.5rem] flex justify-between items-center shadow-xl">
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Coverage</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">18,242 <span className="text-sm uppercase text-gray-400">km</span></p>
                            </div>
                            <div className="h-12 w-[1px] bg-gray-100"></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signal Health</p>
                                <p className="text-3xl font-black text-emerald-500 tracking-tighter">Stable <span className="text-sm uppercase text-gray-400">12ms</span></p>
                            </div>
                        </div>
                        <button className="bg-[#21a0b5] text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#21a0b5]/20 hover:scale-105 transition-all active:scale-95">
                            Launch Full Interface
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;
