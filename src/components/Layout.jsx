import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const MobileHeader = ({ onOpenSidebar }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-40">
            {/* Clickable Brand Name to Open Sidebar */}
            <button
                onClick={onOpenSidebar}
                className="flex items-center gap-2 focus:outline-none"
            >
                <h2 className="text-xl font-black tracking-tighter text-gray-900">
                    FLEET<span className="text-[#21a0b5]">PULSE</span>
                </h2>
                <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center text-[#21a0b5]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </div>
            </button>

            {/* Profile Section */}
            <div className="relative">
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21a0b5] to-[#1a8091] flex items-center justify-center font-black text-white shadow-lg text-sm border-2 border-white"
                >
                    {user.name ? user.name.charAt(0) : 'A'}
                </button>

                <AnimatePresence>
                    {isProfileOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsProfileOpen(false)}
                                className="fixed inset-0 z-[-1]"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 overflow-hidden py-2"
                            >
                                <div className="px-5 py-3 border-b border-gray-50 mb-1">
                                    <p className="text-xs font-black text-gray-900 truncate">{user.name || 'User'}</p>
                                    <p className="text-[10px] font-bold text-gray-400 truncate tracking-tight">{user.email}</p>
                                </div>

                                <button
                                    onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-black text-gray-600 hover:bg-[#21a0b5]/5 hover:text-[#21a0b5] transition-all uppercase tracking-widest"
                                >
                                    <span>👤</span> View Profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest"
                                >
                                    <span>🚪</span> Sign Out
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f3f4f6]">
            {/* Overlay for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`fixed lg:relative z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen transition-all duration-300">
                {/* Mobile Top Header */}
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

                <div className="pt-6 lg:pt-10 px-4 md:px-8 lg:px-16 pb-16 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
