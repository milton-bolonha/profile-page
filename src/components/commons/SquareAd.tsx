import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const SquareAd = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Delay appearance slightly for effect
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-auto"
        >
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/40 w-64 h-64 flex flex-col items-center justify-center text-center">
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <span className="text-gray-400 font-bold text-lg font-mono tracking-widest uppercase">
                        AD SPACE
                    </span>
                </div>
                <p className="mt-4 text-xs text-gray-400 font-sans">
                    Anuncie aqui
                </p>
            </div>
        </motion.div>
    );
};
