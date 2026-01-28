import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const navSections = [
    {
        title: 'Main',
        items: [
            { name: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['SuperAdmin', 'Admin', 'Manager'] },
            { name: 'Live Map', path: '/live-map', icon: '📍', roles: ['SuperAdmin', 'Admin', 'Manager'] },
            { name: 'Analytics', path: '/analytics', icon: '📈', roles: ['SuperAdmin', 'Admin'] },
        ]
    },
    {
        title: 'Fleet Management',
        items: [
            { name: 'Vehicle List', path: '/vehicles', icon: '🚛', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Device List', path: '/devices', icon: '📡', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Client List', path: '/clients', icon: '🏢', roles: ['SuperAdmin'] },
            { name: 'Transporters', path: '/transporters', icon: '�', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Technicians', path: '/technicians', icon: '🔧', roles: ['SuperAdmin', 'Admin'] },
        ]
    },
    {
        title: 'Operations',
        items: [
            { name: 'Alerts', path: '/alerts', icon: '🔔', roles: ['SuperAdmin', 'Admin', 'Manager'] },
            { name: 'Maintenance', path: '/maintenance', icon: '⚒️', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Geofences', path: '/geofences', icon: '🛑', roles: ['SuperAdmin', 'Admin'] },
        ]
    },
    {
        title: 'Reports & Tools',
        items: [
            { name: 'General Reports', path: '/reports', icon: '📋', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Distance Report', path: '/distance-report', icon: '📏', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Route Playback', path: '/playback', icon: '🔄', roles: ['SuperAdmin', 'Admin', 'Manager'] },
            { name: 'Fuel Price', path: '/fuel-price', icon: '⛽', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Check License/RC', path: '/checks', icon: '🆔', roles: ['SuperAdmin', 'Admin'] },
        ]
    },
    {
        title: 'System',
        items: [
            { name: 'Users', path: '/users', icon: '👤', roles: ['SuperAdmin'] },
            { name: 'Settings', path: '/settings', icon: '⚙️', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Announcements', path: '/announcements', icon: '📢', roles: ['SuperAdmin', 'Admin'] },
            { name: 'Support', path: '/support', icon: '🎧', roles: ['SuperAdmin', 'Admin', 'Manager'] },
        ]
    }
];

const Sidebar = ({ onClose }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || 'Manager';

    return (
        <div className="h-screen w-72 bg-[#0a111a] text-white flex flex-col z-50 shadow-2xl overflow-hidden border-r border-white/5">

            {/* Brand Logo - Fixed */}
            <div className="p-8 pb-6 bg-[#0a111a] z-10 relative">
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="lg:hidden absolute right-4 top-8 p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-black tracking-tighter text-white">
                    FLEET<span className="text-[#21a0b5]">PULSE</span>
                </h2>
                <div className="flex items-center gap-2 mt-2">
                    <div className="h-1 w-8 bg-[#21a0b5] rounded-full"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{userRole} Node</span>
                </div>
            </div>

            {/* Navigation - Scrollable Area */}
            <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-10">
                <div className="space-y-8">
                    {navSections.map((section, idx) => {
                        const visibleItems = section.items.filter(item => item.roles.includes(userRole));

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={idx} className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 px-4 mb-2">
                                    {section.title}
                                </h3>
                                {visibleItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                                                ? 'bg-[#21a0b5] text-white shadow-xl shadow-[#21a0b5]/20'
                                                : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                                                    {item.icon}
                                                </span>
                                                <span className="text-[13px] font-bold tracking-wide">
                                                    {item.name}
                                                </span>

                                                {/* Tiny active arrow */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-nav-bg"
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 rounded-2xl pointer-events-none"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* User Info - Fixed Bottom */}
            <div className="p-6 bg-[#080d14] border-t border-white/5">
                <div className="flex items-center gap-3 mb-5 px-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21a0b5] to-[#1a8091] flex items-center justify-center font-black text-white shadow-lg">
                        {user.name ? user.name.charAt(0) : 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-black truncate text-white">{user.name || 'Administrator'}</p>
                        <p className="text-[10px] font-bold text-gray-500 truncate">{user.email || 'system@fleetpulse.com'}</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/login';
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all duration-300 text-xs font-black tracking-widest uppercase border border-red-500/20"
                >
                    <span>🚪</span> Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
