import React from 'react';

export const BottomAdBanner = () => {


    return (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[110] pointer-events-auto">
            <div className="relative group">

                {/* Ad Container */}
                <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-t-lg shadow-2xl flex items-center justify-center min-w-[320px] md:min-w-[728px] h-[90px]">
                    <div className="w-full h-full border border-dashed border-white/20 rounded flex items-center justify-center bg-white/5">
                        <span className="text-white/30 text-xs font-mono tracking-widest uppercase">
                            Espaço Publicitário (728x90)
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};
