import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand, FaTimes } from 'react-icons/fa';

export const ImmersiveModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenImmersiveModal');
        // Check if not seen AND not currently in fullscreen
        if (!hasSeen && !document.fullscreenElement) {
            // Small delay to appear after initial load
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleFullscreen = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error(err);
        }
        closeModal();
    };

    const closeModal = () => {
        localStorage.setItem('hasSeenImmersiveModal', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative"
                    >
                        <h2 className="text-sm font-bold text-white mb-2" style={{ fontFamily: '"Inter Variable", sans-serif' }}>Experiência Imersiva</h2>
                        <p className="text-white/60 mb-8 leading-relaxed text-sm">
                            Este portfólio foi desenhado para ser explorado em tela cheia para melhor experiência imersiva.
                        </p>

                        <div className="flex flex-row gap-4 justify-center">
                            <button
                                onClick={handleFullscreen}
                                className="group flex flex-col items-center justify-center w-28 h-28 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl border border-white/20 transition-all duration-300 gap-2 cursor-pointer"
                            >
                                <FaExpand className="text-2xl mb-1" />
                                <span className="text-xs font-bold leading-tight">Tela Cheia<br />(F11)</span>
                            </button>

                            <button
                                onClick={closeModal}
                                className="group flex flex-col items-center justify-center w-28 h-28 bg-transparent hover:bg-white/5 text-white/40 hover:text-white rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 gap-2 cursor-pointer"
                            >
                                <FaTimes className="text-2xl mb-1" />
                                <span className="text-xs font-medium leading-tight">Continuar<br />Navegando</span>
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
