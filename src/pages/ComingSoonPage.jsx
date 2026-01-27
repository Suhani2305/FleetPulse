import React from 'react';
import { motion } from 'framer-motion';

const ComingSoonPage = ({ title }) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-32 h-32 bg-[#21a0b5]/10 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-inner"
            >
                ⏳
            </motion.div>
            <div className="space-y-2">
                <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic">
                    {title} <span className="text-[#21a0b5]">Incoming</span>
                </h1>
                <p className="text-gray-400 font-bold uppercase tracking-[0.5em] text-xs">This feature is currently under active development</p>
                <div className="w-24 h-1.5 bg-[#21a0b5] mx-auto rounded-full mt-8"></div>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-lg mt-12">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: [-100, 200] }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                            className="w-20 h-full bg-[#21a0b5]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComingSoonPage;
