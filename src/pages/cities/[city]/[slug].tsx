import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPostSlugs, getPostData, PostData, getSortedPostsData } from '@/lib/posts';
import { getSeoSettings } from '@/lib/seoSettings';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ClientOnly } from '@/components/commons/ClientOnly';
import { CustomSignInButton } from "@/components/commons/clerk/SignInButton";
import Seo from '@/components/commons/Seo';
import dynamic from 'next/dynamic';
import { FaMapMarkerAlt, FaHome, FaExternalLinkAlt, FaCheck, FaTag, FaLayerGroup, FaDatabase, FaServer, FaCode } from 'react-icons/fa';
import citiesData from "../../../../content/cities.json";
import { GridBackground } from "@/components/commons/GridBackground";
import ContactSection from "@/components/Home/ContactSection";
import { normalizeImage } from "@/lib/media";
import { extractTableData, getSpecValue } from '@/lib/extractTableData';
import { TechnicalSidebar } from '@/components/catalog/TechnicalSidebar';

const SignedIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedIn), { ssr: false });
const SignedOut = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedOut), { ssr: false });

interface CityPostProps {
    postData: PostData;
    seoSettings: any;
    city: { id: string, name: string };
    relatedPosts: PostData[];
}

const CityCatalogItem = ({ postData, seoSettings, city, relatedPosts }: CityPostProps) => {
    if (!postData || !city) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-black">Carregando...</div>;
    }

    // Extract technical specs from markdown
    const { specs, contentWithoutTable } = extractTableData(postData.content);

    // Generate placeholder images (4 images for gallery)
    const galleryImages = [
        normalizeImage((postData as any).featuredImage, postData.title),
        normalizeImage(null, `${postData.title} em ${city.name} - Vista 2`),
        normalizeImage(null, `${postData.title} em ${city.name} - Vista 3`),
        normalizeImage(null, `${postData.title} em ${city.name} - Detalhes`),
    ];

    // Get link from specs if available (fallback) or frontmatter (primary)
    const linkSpec = getSpecValue(specs, 'Link') || getSpecValue(specs, 'Demo');
    const externalLink = postData.link || (linkSpec && !linkSpec.includes('N/A') && !linkSpec.includes('Sob') ? linkSpec : undefined);

    const bannerImage = galleryImages[0];

    // SEO Injection: "Item em City"
    const localTitle = `${postData.title} em ${city.name}`;
    const localDescription = `Encontre ${postData.title} de alta qualidade em ${city.name}. Soluções de ${postData.category} verificadas e disponíveis para ${city.name} e região.`;

    const seoData = {
        title: localTitle,
        description: localDescription,
        keywords: [...((postData as any).keywords || []), city.name, `em ${city.name}`, "Ribeirão Preto região"],
        author: postData.author,
        siteUrl: seoSettings.siteUrl,
        slug: `/cities/${city.id}/${postData.slug}`,
        articleUrl: `${seoSettings.siteUrl}/cities/${city.id}/${postData.slug}`,
        featuredImage: bannerImage || seoSettings.defaultImage,
        brandCardImage: seoSettings.brandCardImage,
        topology: 'post' as const,
        datePublished: postData.date,
        themeColor: seoSettings.themeColor,
        twitterHandle: seoSettings.twitterHandle,
        locale: seoSettings.locale,
    };

    const ImageRenderer = ({ node, ...props }: any) => {
        return (
            <div className="flex justify-center items-center mb-8">
                <Image
                    {...props}
                    alt={`${props.alt || 'Imagem'} em ${city.name}`}
                    width={800}
                    height={600}
                    className="w-full h-auto max-w-3xl rounded-xl shadow-2xl border border-white/10"
                />
            </div>
        );
    };

    const ParagraphRenderer = ({ node, ...props }: any) => {
        return (
            <p {...props} className="mb-6 leading-relaxed text-lg text-white/70" />
        );
    };

    const HeadingRenderer = ({ node, ...props }: any) => {
        return <h2 {...props} className="text-2xl font-bold text-white mt-8 mb-4" />;
    };

    return (
        <>
            <Seo data={seoData} />
            <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white relative catalog-page">
                {/* Background Grid */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                    <GridBackground inverted={false} />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Navigation */}
                    <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
                        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
                            {/* Left: Back */}
                            <div className="flex justify-start">
                                <Link href={`/cities/${city.id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium">
                                    &larr; Voltar
                                </Link>
                            </div>

                            {/* Center: Home */}
                            <div className="flex justify-center">
                                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-yellow-400 transition-colors font-semibold uppercase tracking-widest text-sm">
                                    <FaHome size={18} />
                                    <span className="hidden md:inline">Home</span>
                                </Link>
                            </div>

                            {/* Right: Location + Link */}
                            <div className="flex justify-end items-center gap-4">
                                <div className="text-white/70 text-sm flex items-center gap-1">
                                    <FaMapMarkerAlt /> <span className="hidden md:inline">{city.name}, SP</span>
                                </div>
                                {externalLink && (
                                    <a
                                        href={externalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-sm"
                                    >
                                        <span className="hidden md:inline">Visitar</span>
                                        <FaExternalLinkAlt size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hero Header - Compact */}
                    <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-gray-900 to-black">
                        <div className="max-w-7xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 font-semibold text-xs mb-4 uppercase tracking-wider">
                                <FaMapMarkerAlt />
                                Disponible em {city.name}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {postData.title}
                            </h1>
                            {(postData as any).description && (
                                <p className="text-xl text-white/60 max-w-3xl">
                                    {(postData as any).description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Main Content with Sidebar */}
                    <div className="container mx-auto px-6 max-w-7xl py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                            {/* Main Content */}
                            <main>
                                {/* Attributes Header */}
                                {specs.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 border-b border-white/10 pb-12">
                                        {specs.map((spec, idx) => {
                                            if (['Link', 'Demo'].includes(spec.label)) return null;

                                            let icon = <FaCheck className="text-green-400" />;
                                            let colorClass = "text-white";

                                            if (spec.label === 'Categoria') { icon = <FaTag className="text-blue-400" />; colorClass = "text-blue-100"; }
                                            if (spec.label === 'Tipo') { icon = <FaLayerGroup className="text-purple-400" />; }
                                            if (spec.label === 'Stack Principal') { icon = <FaCode className="text-yellow-400" />; colorClass = "text-yellow-100 font-bold"; }
                                            if (spec.label === 'Tecnologias') { icon = <FaDatabase className="text-cyan-400" />; }
                                            if (spec.label === 'Status') { icon = <FaCheck className="text-green-400" />; }

                                            return (
                                                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                                                        {icon}
                                                        {spec.label}
                                                    </div>
                                                    <div className={`text-sm leading-relaxed ${colorClass}`}>
                                                        {spec.value}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {postData.public ? (
                                    <div className="prose prose-lg prose-invert max-w-none
                                        prose-headings:text-white prose-h2:text-white prose-h3:text-white
                                        prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white
                                        prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:underline prose-a:decoration-blue-400/50
                                        prose-blockquote:border-l-white prose-blockquote:bg-white/5 prose-blockquote:text-gray-300
                                        prose-code:text-gray-200 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded
                                        prose-th:text-white prose-td:text-gray-300">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                                img: ImageRenderer,
                                                p: ParagraphRenderer,
                                                h2: HeadingRenderer,
                                            }}
                                        >
                                            {contentWithoutTable}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="max-w-2xl mx-auto my-8">
                                        <ClientOnly>
                                            <SignedOut>
                                                <div className="bg-red-900/10 border border-red-500/20 text-red-200 px-8 py-10 rounded-2xl text-center backdrop-blur-sm">
                                                    <h3 className="text-2xl font-bold mb-4">Acesso Restrito em {city.name} 🔒</h3>
                                                    <p className="mb-8 text-white/70">Este conteúdo é exclusivo para membros. Faça login para continuar.</p>
                                                    <CustomSignInButton />
                                                </div>
                                            </SignedOut>
                                            <SignedIn>
                                                <div className="prose prose-lg prose-invert max-w-none">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeRaw]}
                                                        components={{
                                                            img: ImageRenderer,
                                                            p: ParagraphRenderer,
                                                        }}
                                                    >
                                                        {contentWithoutTable}
                                                    </ReactMarkdown>
                                                </div>
                                            </SignedIn>
                                        </ClientOnly>
                                    </div>
                                )}
                            </main>

                            {/* Sidebar */}
                            <TechnicalSidebar
                                specs={specs}
                                images={galleryImages}
                                title={`${postData.title} em ${city.name}`}
                                link={externalLink}
                                technologies={postData.technologies}
                                relatedPosts={relatedPosts}
                                category={postData.category}
                            />
                        </div>
                    </div>

                    {/* Contact Footer */}
                    <div className="relative z-10 w-full bg-black">
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

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = getSortedPostsData();
    const paths: any[] = [];

    // Generate Cartesian Product: Cities * Posts
    citiesData.forEach(city => {
        posts.forEach(post => {
            paths.push({
                params: {
                    city: city.id,
                    slug: post.slug
                }
            });
        });
    });

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<CityPostProps> = async ({ params }) => {
    const postData = await getPostData(params?.slug as string);
    const seoSettings = getSeoSettings();
    const city = citiesData.find(c => c.id === params?.city) || { id: 'sp', name: 'São Paulo' };
    const allPosts = getSortedPostsData();

    const relatedPosts = allPosts
        .filter(p => p.category === postData.category && p.slug !== postData.slug && p.published)
        .slice(0, 3);

    return {
        props: {
            postData,
            seoSettings,
            city,
            relatedPosts
        },
    };
};

export default CityCatalogItem;
