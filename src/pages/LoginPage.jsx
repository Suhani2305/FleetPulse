import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Admin'); // Default Role
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }), // Sending selected role
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login details galat hain!');
            }
        } catch (err) {
            setError('Backend se connection nahi ho paa raha. Please "npm run dev" check karein.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f1f5f9] items-center justify-center p-4 md:p-10 font-sans">
            <div className="flex w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[700px] border border-gray-100">

                {/* LEFT PANEL */}
                <div className="hidden md:flex flex-col w-1/2 bg-[#21a0b5] p-16 text-white relative overflow-hidden">
                    <div className="mb-12 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                        <span className="text-3xl">📍</span>
                    </div>

                    <h1 className="text-5xl font-black leading-[1.1] mb-10 tracking-tight">
                        The Hub for your <br /> Fleet Management!
                    </h1>

                    <ul className="space-y-8 text-base font-medium">
                        <li className="flex gap-4 items-center">
                            <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[10px]">✓</span>
                            Real-time asset tracking through IoT sync.
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[10px]">✓</span>
                            Smart analytics to minimize operational costs.
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[10px]">✓</span>
                            Enterprise-grade fleet security protocols.
                        </li>
                    </ul>

                    <div className="mt-auto pt-10">
                        <p className="text-sm font-bold opacity-60 tracking-widest uppercase">FleetPulse v2.0</p>
                    </div>

                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md mx-auto w-full">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center space-y-3 mb-12">
                                <motion.h2
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-4xl font-black text-gray-900 tracking-tighter uppercase"
                                >
                                    Login to <span className="text-[#21a0b5]">Access</span>
                                </motion.h2>
                                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Fleet Management Portal</p>
                                <div className="w-12 h-1 bg-[#21a0b5] mx-auto rounded-full mt-4"></div>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-8">

                                {error && (
                                    <div className="bg-red-50 text-red-700 py-3 px-4 rounded-2xl text-xs font-bold text-center border border-red-100 italic">
                                        ⚠ {error}
                                    </div>
                                )}

                                {/* ROLE SELECTION */}
                                <div className="grid grid-cols-3 gap-3 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                                    {['SuperAdmin', 'Admin', 'Manager'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === r ? 'bg-white text-[#21a0b5] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email / Phone</label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border-none ring-1 ring-gray-100 bg-gray-50 focus:ring-2 focus:ring-[#21a0b5]/50 outline-none transition-all text-sm font-semibold text-gray-900 placeholder:text-gray-300"
                                        placeholder="name@fleetpulse.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
                                        <button type="button" className="text-[10px] font-bold text-red-500 tracking-wide uppercase hover:underline">Reset?</button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl border-none ring-1 ring-gray-100 bg-gray-50 focus:ring-2 focus:ring-[#21a0b5]/50 outline-none transition-all text-sm font-semibold text-gray-900 placeholder:text-gray-300"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-lg opacity-40 hover:opacity-100 transition-opacity"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#21a0b5] hover:bg-[#1c8a9c] text-white py-5 rounded-[1.5rem] font-black tracking-[0.2em] uppercase text-xs shadow-xl shadow-[#21a0b5]/20 transition-all"
                                >
                                    {isLoading ? 'Decrypting...' : 'Open Dashboard'}
                                </motion.button>
                            </form>

                            <div className="mt-12 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                                    FleetPulse . v2.10
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
