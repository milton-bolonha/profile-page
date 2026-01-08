import { FaCheckCircle, FaExternalLinkAlt, FaCode, FaLayerGroup } from 'react-icons/fa';
import { TechnicalSpec } from '@/lib/extractTableData';

interface ItemHUDProps {
    stats: {
        status?: string;
        type?: string;
        stack?: string;
        category?: string;
    };
    link?: string;
    demoLink?: string;
}

export const ItemHUD = ({ stats, link, demoLink }: ItemHUDProps) => {
    return (
        <div className="w-full bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-10 overflow-hidden relative group">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* Left: Stats Grid */}
                <div className="flex flex-wrap gap-x-8 gap-y-4">

                    {/* Status */}
                    {stats.status && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Status</span>
                            <div className="flex items-center gap-2 text-white font-medium">
                                {stats.status.includes('✅') && <FaCheckCircle className="text-green-400" />}
                                {stats.status}
                            </div>
                        </div>
                    )}

                    {/* Type */}
                    {stats.type && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Tipo</span>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <FaLayerGroup className="text-yellow-500/80" />
                                {stats.type}
                            </div>
                        </div>
                    )}

                    {/* Stack */}
                    {stats.stack && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Stack Core</span>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <FaCode className="text-blue-400/80" />
                                {stats.stack}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    {link && (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-sm transition-all flex items-center gap-2"
                        >
                            Visitar
                            <FaExternalLinkAlt size={12} />
                        </a>
                    )}

                    {demoLink && (
                        <a
                            href={demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
                        >
                            Ver Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
