import { GetStaticPaths, GetStaticProps } from 'next';
import Head from "next/head";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBusinessSettings, getGeneralSettings } from "@/lib/settings";
import { getSortedPostsData, PostData } from "@/lib/posts";
import { ClientOnly } from "@/components/commons/ClientOnly";
import { FaRobot, FaGlobe, FaBook, FaGamepad, FaChalkboardTeacher, FaRocket, FaMapMarkerAlt } from "react-icons/fa";
import citiesData from "../../../../content/cities.json";
import { GridBackground } from "@/components/commons/GridBackground";
import ContactSection from "@/components/Home/ContactSection";
import { normalizeImage } from "@/lib/media";
import { getCategoryGradient, getCategoryColor } from "@/lib/colors";

interface CityCatalogProps {
    businessSettings: any;
    generalSettings: any;
    allPosts: PostData[];
    city: { id: string, name: string };
}

// ... imports

const CATEGORIES = [
    { id: "Todos", label: "Todos", icon: null },
    { id: "AI", label: "AI Solutions", icon: FaRobot },
    { id: "WEB", label: "Web Services", icon: FaGlobe },
    { id: "GAME DEV", label: "Game Dev", icon: FaGamepad },
    { id: "BOOK", label: "Books", icon: FaBook },
    { id: "MENTORIA", label: "Mentoria", icon: FaChalkboardTeacher },
    { id: "ENTREPRENEUR", label: "Entrepreneur", icon: FaRocket },
];

const CityCatalogContent = ({
    businessSettings,
    allPosts,
    city
}: CityCatalogProps) => {
    const { t } = useLanguage();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [filteredPosts, setFilteredPosts] = useState<PostData[]>(allPosts);

    // Filter posts when category changes
    useEffect(() => {
        if (selectedCategory === "Todos") {
            setFilteredPosts(allPosts);
        } else {
            setFilteredPosts(allPosts.filter((post) => post.category === selectedCategory));
        }
    }, [selectedCategory, allPosts]);

    return (
        <>
            <Head>
                <title>
                    Catálogo em {city.name} | {businessSettings.brandName}
                </title>
                <meta
                    name="description"
                    content={`Catálogo completo de soluções de IA, Web e Mentoria em ${city.name} por ${businessSettings.brandName}.`}
                />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="min-h-screen bg-black text-white relative catalog-page">
                {/* Background Grid - VISIBLE */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <GridBackground inverted={false} />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Header */}
                    <div className="pt-32 pb-16 px-6 bg-black/20 backdrop-blur-sm shadow-2xl">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 font-bold text-sm mb-6 uppercase tracking-wider shadow-lg">
                                <FaMapMarkerAlt />
                                Atendendo {city.name} e Região
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                                Soluções Digitais em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{city.name}</span>
                            </h1>

                            <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                                Desenvolvimento de software, inteligência artificial e consultoria especializada disponível para empresas e profissionais de {city.name}.
                            </p>
                        </div>
                    </div>

                    {/* Filters (No Border) */}
                    <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md py-4 shadow-xl">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-wrap justify-center gap-3 pb-2 md:pb-0">
                                {CATEGORIES.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = selectedCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer
                                        ${isActive
                                                    ? `${getCategoryColor(cat.id)} scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]`
                                                    : `${getCategoryColor(cat.id)} hover:border-yellow-500 hover:shadow-yellow-500/20`}
                                    `}
                                        >
                                            {Icon && <Icon className={isActive ? "text-white" : "text-gray-400"} />}
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="max-w-7xl mx-auto px-6 py-24">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/cities/${city.id}/${post.slug}`}
                                        className="group flex flex-col bg-neutral-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-500 hover:shadow-yellow-500/20 hover:shadow-2xl transition-all duration-300 h-full cursor-pointer relative"
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-black">
                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 z-10 opacity-40 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-20 ${getCategoryGradient(post.category)}`} />

                                            {/* Image */}
                                            <img
                                                src={normalizeImage((post as any).featuredImage, post.title)}
                                                alt={post.title}
                                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = normalizeImage(null, post.title); // Fallback to placeholder
                                                }}
                                            />

                                            {/* Colored Badge */}
                                            <div className={`absolute top-4 right-4 z-20 backdrop-blur border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg ${getCategoryColor(post.category)}`}>
                                                {post.category || 'Geral'}
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                                                {post.title}
                                            </h3>

                                            <div className="text-gray-300 text-base mb-6 line-clamp-3 font-normal leading-relaxed">
                                                {(post as any).description || `Solução completa de ${post.category} disponível para ${city.name}. Clique para ver detalhes.`}
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                                                <span className="text-xs text-blue-400 font-bold flex items-center gap-1">
                                                    <FaMapMarkerAlt /> {city.name}
                                                </span>
                                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-1">
                                                    Ver Detalhes &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5">
                                <h3 className="text-2xl font-bold text-white mb-2">Nenhum item encontrado</h3>
                                <p className="text-white/50">
                                    Não encontramos itens nesta categoria para {city.name}.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Contact Footer */}
                    <div className="relative z-10 w-full bg-black border-t border-white/10">
                        <ContactSection
                            contacts={[
                                { name: "LinkedIn", link: "https://www.linkedin.com/in/miltonbolonha/" },
                                { name: "GitHub", link: "https://github.com/miltonbolonha" },
                                { name: "Email", link: "contato@miltonbolonha.com.br", isMail: true },
                                { name: "Baixar Currículo", link: "/files/Curriculo 02072025.pdf", isDownload: true },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const CityCatalog = (props: CityCatalogProps) => {
    return (
        <ClientOnly>
            <CityCatalogContent {...props} />
        </ClientOnly>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = citiesData.map((city) => ({
        params: { city: city.id },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<CityCatalogProps> = async ({ params }) => {
    const businessSettings = getBusinessSettings();
    const generalSettings = getGeneralSettings();
    const allPosts = getSortedPostsData();

    const city = citiesData.find(c => c.id === params?.city) || { id: 'sp', name: 'São Paulo' };

    return {
        props: {
            businessSettings,
            generalSettings,
            allPosts,
            city
        },
    };
};

export default CityCatalog;
