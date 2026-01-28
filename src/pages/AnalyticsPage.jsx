import React, { useState } from 'react';
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
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AnalyticsPage = () => {
    const [timeframe, setTimeframe] = useState('Weekly');

    const performanceData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Avg Speed (km/h)',
                data: [45, 52, 49, 60, 55, 42, 38],
                borderColor: '#21a0b5',
                backgroundColor: 'rgba(33, 160, 181, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Fuel Efficiency (%)',
                data: [80, 75, 82, 70, 78, 85, 88],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const distanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Total Distance (km)',
            data: [12000, 15000, 11000, 18000, 14000, 16000],
            backgroundColor: '#6366f1',
            borderRadius: 12,
        }]
    };

    const stats = [
        { label: 'Total Distance', value: '84,291 km', icon: '🛣️', trend: '+12% vs last month', color: 'text-blue-500' },
        { label: 'Fuel Saved', value: '1,240 L', icon: '🍃', trend: '+5% optimization', color: 'text-emerald-500' },
        { label: 'Idle Time', value: '2.4 hrs/day', icon: '⏱️', trend: '-18% reduction', color: 'text-amber-500' },
        { label: 'Delivery Efficiency', value: '94.2%', icon: '🚀', trend: 'Highest this year', color: 'text-[#21a0b5]' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Fleet <span className="text-[#21a0b5]">Analytics</span>
                    </motion.h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Strategic insights and performance metrics</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    {['Daily', 'Weekly', 'Monthly'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-[#21a0b5] text-white' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl group-hover:scale-120 transition-transform">{s.icon}</div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{s.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{s.value}</h3>
                        <p className={`text-[9px] font-black uppercase ${s.color}`}>{s.trend}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="mb-10">
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Efficiency Metrics</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Correlation between speed and fuel</p>
                    </div>
                    <div className="h-80">
                        <Line data={performanceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 10 } } } } }} />
                    </div>
                </motion.div>

                <motion.div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="mb-10">
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Distance Performance</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Monthly fleet coverage breakdown</p>
                    </div>
                    <div className="h-80">
                        <Bar data={distanceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </motion.div>
            </div>

            {/* Detailed Analysis Table */}
            <div className="bg-[#0a111a] p-12 rounded-[3.5rem] text-white">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black tracking-tight uppercase">Top Performing Assets</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-[#21a0b5] hover:underline">Download Report</button>
                </div>
                <div className="space-y-4">
                    {[
                        { plate: 'HR-26-CZ-9021', driver: 'Rajesh Kumar', score: 98, savings: '₹12,400', status: 'Excellent' },
                        { plate: 'DL-01-BK-5521', driver: 'Amit Sharma', score: 92, savings: '₹8,200', status: 'Optimal' },
                        { plate: 'UP-14-XY-7732', driver: 'Vikas Singh', score: 85, savings: '₹4,500', status: 'Good' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-[#21a0b5] rounded-xl flex items-center justify-center font-black">{row.score}</div>
                                <div>
                                    <p className="font-black text-lg">{row.plate}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{row.driver}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-emerald-400">{row.savings}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">{row.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
