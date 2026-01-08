import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBusinessSettings, getGeneralSettings } from "@/lib/settings";
import { getSortedPostsData, PostData } from "@/lib/posts";
import { ClientOnly } from "@/components/commons/ClientOnly";
import { FaRobot, FaGlobe, FaBook, FaGamepad, FaChalkboardTeacher, FaRocket, FaHome, FaFilter } from "react-icons/fa";
import { GridBackground } from "@/components/commons/GridBackground";
import ContactSection from "@/components/Home/ContactSection";
import { normalizeImage } from "@/lib/media";
import { getCategoryGradient, getCategoryColor } from "@/lib/colors";
import { CatalogFilterSidebar } from "@/components/catalog/CatalogFilterSidebar";

interface CatalogoProps {
    businessSettings: any;
    generalSettings: any;
    allPosts: PostData[];
}

// Links to categories
const CATEGORIES = [
    { id: "Todos", label: "Todos", icon: FaFilter },
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

            <div className="min-h-screen bg-black text-white relative catalog-page font-sans">
                {/* Background Grid - VISIBLE */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <GridBackground inverted={false} />
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 flex flex-col min-h-screen">

                    {/* Header */}
                    <div className="pt-8 pb-12 px-6 bg-black/40 backdrop-blur-sm">
                        <div className="full-width mx-auto flex flex-col gap-6">

                            <div className="flex flex-col items-center full-width">
                                <Link href="/" className="mb-6 group flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500 hover:text-yellow-400 transition-all duration-300">
                                    <FaHome className="text-sm" />
                                    <span className="font-bold text-xs tracking-widest uppercase">Voltar ao Início</span>
                                </Link>

                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
                                    Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Soluções</span>
                                </h1>
                                <p className="text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
                                    Explore produtos de IA, serviços web, games e mentorias.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="max-w-8xl mx-auto px-6 py-12 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

                            {/* Main Grid Content (Left) */}
                            <div className="order-2 lg:order-1">
                                {filteredPosts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                            target.src = normalizeImage(null, post.title);
                                                        }}
                                                    />

                                                    {/* Colored Badge */}
                                                    <div className={`absolute top-4 right-4 z-20 backdrop-blur border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg ${getCategoryColor(post.category)}`}>
                                                        {post.category || 'Geral'}
                                                    </div>
                                                </div>

                                                <div className="p-6 flex-1 flex flex-col">
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors leading-tight">
                                                        {post.title}
                                                    </h3>

                                                    <div className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed font-normal">
                                                        {(post as any).description || "Solução completa disponível. Clique para ver detalhes."}
                                                    </div>

                                                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                                                        <span className="text-xs text-yellow-500/80 font-bold uppercase tracking-wider group-hover:text-yellow-400 transition-colors flex items-center gap-1">
                                                            Acessar Item &rarr;
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
                                            onClick={() => updateCategory("Todos")}
                                            className="mt-6 text-yellow-400 hover:text-yellow-300 font-medium underline underline-offset-4"
                                        >
                                            Limpar filtros
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Filters (Right) */}
                            <div className="order-1 lg:order-2">
                                <CatalogFilterSidebar
                                    categories={CATEGORIES.filter(cat =>
                                        cat.id === "Todos" || allPosts.some(post => post.category === cat.id)
                                    )}
                                    selectedCategory={selectedCategory}
                                    onSelectCategory={updateCategory}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Contact Section at the bottom */}
                    <div className="relative z-10 w-full bg-black mt-auto">
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
