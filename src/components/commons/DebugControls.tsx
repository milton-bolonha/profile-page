import React, { useState, useEffect } from 'react';
import { FaBug } from 'react-icons/fa';

export const DebugControls = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show in development or if a specific flag is set
        if (process.env.NODE_ENV === 'development' || typeof window !== 'undefined') {
            setIsVisible(true);
        }
    }, []);

    const handleReset = () => {
        // Reset specific keys or clear all
        localStorage.removeItem('hasInteractedWithPoll');
        localStorage.removeItem('hasSeenImmersiveModal');
        // localStorage.clear(); // Optional: if we want to nuke everything

        window.location.reload();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-28 right-6 z-[9999] font-mono text-xs">
            <button
                onClick={handleReset}
                className="bg-red-500/20 hover:bg-red-500 text-white p-3 rounded-full transition-all backdrop-blur-sm shadow-lg group relative"
                title="Reset All & Reload"
            >
                <FaBug className="text-lg" />

                {/* Tooltip on hover */}
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/80 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                    Reset & Reload
                </span>
            </button>
        </div>
    );
};
