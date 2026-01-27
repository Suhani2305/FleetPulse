import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[#f3f4f6]">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-72 pt-10 px-16 pb-16 min-h-screen transition-all duration-300">
                <div className="max-w-[1600px] mx-auto bg-transparent">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
