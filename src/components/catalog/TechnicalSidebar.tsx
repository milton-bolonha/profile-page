import { TechnicalSpec } from '@/lib/extractTableData';
import { ImageGallery } from './ImageGallery';
import { FaCheckCircle, FaExternalLinkAlt, FaPlus, FaCode, FaDatabase, FaServer, FaTools } from 'react-icons/fa';
import Link from 'next/link';
import { PostData } from '@/lib/posts';
import { normalizeImage } from '@/lib/media';
import {
    SiNextdotjs, SiOpenai, SiMongodb, SiClerk, SiStripe, SiTailwindcss,
    SiReact, SiPrisma, SiPostgresql, SiVercel, SiTypescript, SiJavascript,
    SiNodedotjs, SiPython, SiDocker, SiAmazon, SiGooglecloud, SiFirebase
} from 'react-icons/si';

interface TechnicalSidebarProps {
    specs: TechnicalSpec[];
    images: string[];
    title: string;
    link?: string;
    technologies?: string[];
    relatedPosts?: PostData[];
    category?: string;
}

export const TechnicalSidebar = ({ specs, images, title, link, technologies, relatedPosts, category }: TechnicalSidebarProps) => {

    // Helper to get icon for tech
    const getTechIcon = (tech: string) => {
        const lower = tech.toLowerCase().trim();
        if (lower.includes('next')) return <SiNextdotjs className="text-white hover:text-white" />;
        if (lower.includes('openai') || lower.includes('gpt')) return <SiOpenai className="text-green-400 hover:text-green-300" />;
        if (lower.includes('mongo')) return <SiMongodb className="text-green-500 hover:text-green-400" />;
        if (lower.includes('clerk')) return <FaCheckCircle className="text-blue-400" />; // No simple icon for Clerk yet, fallback
        if (lower.includes('stripe')) return <SiStripe className="text-purple-400 hover:text-purple-300" />;
        if (lower.includes('tailwind')) return <SiTailwindcss className="text-cyan-400 hover:text-cyan-300" />;
        if (lower.includes('react')) return <SiReact className="text-blue-400 hover:text-blue-300" />;
        if (lower.includes('prisma')) return <SiPrisma className="text-white hover:text-gray-300" />;
        if (lower.includes('postgres')) return <SiPostgresql className="text-blue-400 hover:text-blue-300" />;
        if (lower.includes('vercel')) return <SiVercel className="text-white hover:text-gray-300" />;
        if (lower.includes('typescript')) return <SiTypescript className="text-blue-500" />;
        if (lower.includes('javascript')) return <SiJavascript className="text-yellow-400" />;
        if (lower.includes('node')) return <SiNodedotjs className="text-green-500" />;
        if (lower.includes('docker')) return <SiDocker className="text-blue-500" />;
        if (lower.includes('aws')) return <SiAmazon className="text-yellow-500" />;
        if (lower.includes('firebase')) return <SiFirebase className="text-yellow-400" />;
        if (lower.includes('python')) return <SiPython className="text-blue-400" />;
        return <FaCode className="text-gray-400" />;
    };

    // Use technologies prop if available, otherwise fall back to specs parsing
    const allTechs = technologies && technologies.length > 0
        ? technologies
        : Array.from(new Set(
            specs.filter(s => ['Stack Principal', 'Tecnologias'].some(label => s.label.includes(label)))
                .flatMap(spec => spec.value.split(',').map(t => t.trim()))
        ));

    return (
        <aside className="space-y-6">
            {/* CTA Button */}
            <div className="w-full">
                {link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-transparent hover:bg-white/10 text-white font-bold py-4 px-6 rounded-xl border-2 border-white/20 hover:border-white/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Acessar Projeto</span>
                        <FaExternalLinkAlt className="text-sm" />
                    </a>
                ) : null}
            </div>

            {/* Tech Stack Icons (Right Sidebar) */}
            {allTechs.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center py-4 border-b border-white/5">
                    {allTechs.map((tech, idx) => (
                        <div key={idx} className="relative group cursor-help">
                            <div className="text-2xl transition-transform group-hover:scale-110">
                                {getTechIcon(tech)}
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-50">
                                {tech}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Gallery */}
            <div>
                <ImageGallery images={images} title={title} />

                {/* Detailed Specs list REMOVED as requested */}

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && category && (
                    <div className="mt-8">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            + {category}
                        </h3>
                        <div className="space-y-4">
                            {relatedPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/catalogo/${post.slug}`}
                                    className="block group relative rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300"
                                >
                                    {/* Image (if available) - using a simple height constraint */}
                                    <div className="h-32 w-full relative">
                                        <img
                                            src={normalizeImage(post.featuredImage, post.title)}
                                            alt={post.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                    </div>

                                    <div className="p-4 relative mt-[-40px]">
                                        <div className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors shadow-lg">
                                            {post.title}
                                        </div>
                                        {post.description && (
                                            <div className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                                                {post.description}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
