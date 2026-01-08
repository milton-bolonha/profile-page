import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBusinessSettings, getGeneralSettings } from "@/lib/settings";
import { getSortedPostsData, PostData } from "@/lib/posts";
import { ClientOnly } from "@/components/commons/ClientOnly";
import { FaRobot, FaGlobe, FaBook, FaGamepad, FaChalkboardTeacher, FaRocket, FaHome } from "react-icons/fa";
import { GridBackground } from "@/components/commons/GridBackground";
import ContactSection from "@/components/Home/ContactSection";
import { normalizeImage } from "@/lib/media";
import { getCategoryGradient, getCategoryColor } from "@/lib/colors";

interface CatalogoProps {
    businessSettings: any;
    generalSettings: any;
    allPosts: PostData[];
}

// ... imports

// Links to categories
const CATEGORIES = [
    { id: "Todos", label: "Todos", icon: null },
    { id: "AI", label: "AI Solutions", icon: FaRobot },
    { id: "WEB", label: "Web Services", icon: FaGlobe },
    { id: "GAME DEV", label: "Game Dev", icon: FaGamepad },
    { id: "BOOK", label: "Books", icon: FaBook },
    { id: "MENTORIA", label: "Mentoria", icon: FaChalkboardTeacher },
    { id: "ENTREPRENEUR", label: "Entrepreneur", icon: FaRocket },
];

const CatalogoContent = ({
    businessSettings,
    allPosts,
}: CatalogoProps) => {
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

    // Sync with URL query param
    useEffect(() => {
        if (router.query.category && typeof router.query.category === 'string') {
            const cat = router.query.category.toUpperCase();
            // Verify if it's a valid category or mapped one
            if (CATEGORIES.some(c => c.id === cat)) {
                setSelectedCategory(cat);
            }
        }
    }, [router.query]);

    const updateCategory = (category: string) => {
        setSelectedCategory(category);
        // Optional: Update URL without full reload
        // router.push({ query: { ...router.query, category } }, undefined, { shallow: true });
    };

    return (
        <>
            <Head>
                <title>
                    Catálogo | {businessSettings.brandName}
                </title>
                <meta
                    name="description"
                    content={`Catálogo completo de soluções, mentorias e produtos de ${businessSettings.brandName}.`}
                />
            </Head>

            <div className="min-h-screen bg-black text-white relative catalog-page">
                {/* Background Grid - VISIBLE (removed opacity) */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <GridBackground inverted={false} />
                </div>

                {/* Content Wrapper - z-10 to sit above grid */}
                <div className="relative z-10 flex flex-col min-h-screen">

                    {/* Header */}
                    <div className="pt-8 pb-16 px-6 bg-black/20 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

                            {/* HOME BUTTON */}
                            <Link href="/" className="mb-12 group flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500 hover:text-yellow-400 transition-all duration-300">
                                <FaHome className="text-xl" />
                                <span className="font-bold text-sm tracking-widest uppercase">Início</span>
                            </Link>

                            <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-bold tracking-[0.2em] uppercase text-white mb-6 shadow-lg">
                                Portfólio & Produtos
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                                Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Soluções</span>
                            </h1>
                            <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                                Explore nossa gama completa de produtos de IA, serviços web, livros, games e programas de mentoria.
                            </p>
                        </div>
                    </div>

                    {/* Filters - Sticky (No Border) */}
                    <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md py-4 shadow-xl">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-wrap justify-center gap-3 pb-2 md:pb-0">
                                {CATEGORIES.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = selectedCategory === cat.id;
                                    // ... (existing imports, ensure media/colors are added)

                                    // Inside CatalogoContent
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => updateCategory(cat.id)}
                                            className={`
                                                flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer
                                                ${isActive
                                                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-105"
                                                    : "bg-neutral-900 text-gray-300 border-white/10 hover:bg-neutral-800 hover:border-yellow-500 hover:text-white hover:shadow-lg"}
                                            `}
                                        >
                                            {Icon && <Icon className={isActive ? "text-black" : "text-gray-400"} />}
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
                                        href={`/catalogo/${post.slug}`}
                                        className="group flex flex-col bg-neutral-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-500 hover:shadow-yellow-500/20 hover:shadow-2xl transition-all duration-300 h-full cursor-pointer relative"
                                    >
                                        {/* Image Placeholder */}
                                        <div className="aspect-video relative overflow-hidden bg-black">
                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 z-10 opacity-40 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-20 ${getCategoryGradient(post.category)}`} />

                                            {/* Actual Image or Placeholder */}
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
                                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors leading-tight">
                                                {post.title}
                                            </h3>

                                            <div className="text-gray-300 text-base mb-6 line-clamp-3 leading-relaxed font-normal">
                                                {(post as any).description || "Solução completa disponível. Clique para ver detalhes e especificações técnicas."}
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
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
                                    Não encontramos itens nesta categoria no momento.
                                </p>
                                <button
                                    onClick={() => setSelectedCategory("Todos")}
                                    className="mt-6 text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Contact Section at the bottom */}
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

const Catalogo = (props: CatalogoProps) => {
    return (
        <ClientOnly>
            <CatalogoContent {...props} />
        </ClientOnly>
    );
};

export const getStaticProps: GetStaticProps<CatalogoProps> = async () => {
    const businessSettings = getBusinessSettings();
    const generalSettings = getGeneralSettings();
    const allPosts = getSortedPostsData();

    return {
        props: {
            businessSettings,
            generalSettings,
            allPosts,
        },
    };
};

export default Catalogo;
