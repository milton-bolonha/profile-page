import React from 'react';
import dynamic from 'next/dynamic';
import { ClientOnly } from '@/components/commons/ClientOnly';
import Seo from '@/components/commons/Seo';

const StrangerCraftGame = dynamic(
    () => import('@/components/games/StrangerCraftGame'),
    { ssr: false }
);

export default function StrangerCraftPage() {
    const seoData = {
        title: "Stranger Craft - Modo Arquiteto",
        description: "Explore o Mundo Invertido e construa estruturas incríveis neste jogo voxel 3D.",
        siteUrl: "https://miltonbolonha.com.br",
        slug: "/games/stranger-craft",
        author: "Milton Bolonha",
        keywords: ["game", "voxel", "three.js", "react", "minecraft", "stranger things"],
        featuredImage: "/games/stranger-craft/thumb-stranger-a.jpg", // Placeholder
        topology: "page" as const,
    };

    return (
        <>
            <Seo data={seoData} />
            <ClientOnly>
                <div className="relative w-full h-screen bg-black overflow-hidden">
                    <StrangerCraftGame />

                    {/* Back Button Overlay */}
                    <div className="absolute top-4 left-4 z-50 pointer-events-none">
                        <a href="/" className="pointer-events-auto px-4 py-2 bg-black/50 text-white/70 hover:text-white border border-white/20 rounded backdrop-blur transition-all text-sm font-bold uppercase tracking-widest">
                            ← Voltar
                        </a>
                    </div>
                </div>
            </ClientOnly>
        </>
    );
}
