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
import { FaMapMarkerAlt, FaBoxOpen, FaHome } from 'react-icons/fa';
import citiesData from "../../../../content/cities.json";
import { GridBackground } from "@/components/commons/GridBackground";
import ContactSection from "@/components/Home/ContactSection";
import { normalizeImage } from "@/lib/media";

const SignedIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedIn), { ssr: false });
const SignedOut = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedOut), { ssr: false });

interface CityPostProps {
    postData: PostData;
    seoSettings: any;
    city: { id: string, name: string };
}

const CityCatalogItem = ({ postData, seoSettings, city }: CityPostProps) => {
    if (!postData || !city) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-black">Carregando...</div>;
    }



    const bannerImage = normalizeImage((postData as any).featuredImage, postData.title);

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
        const text = props.children?.[0];
        if (text === "Ficha Técnica") {
            return (
                <h2 {...props} className="flex items-center gap-3 text-2xl font-bold text-white mt-8 mb-4">
                    <FaBoxOpen className="text-blue-400" />
                    {props.children}
                </h2>
            );
        }
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
                                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-blue-400 transition-colors font-semibold uppercase tracking-widest text-sm">
                                    <FaHome size={18} />
                                    <span className="hidden md:inline">Home</span>
                                </Link>
                            </div>

                            {/* Right: Location */}
                            <div className="flex justify-end">
                                <div className="text-white/40 text-sm flex items-center gap-1">
                                    <FaMapMarkerAlt /> <span className="hidden md:inline">{city.name}, SP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero / Banner Section */}
                    {bannerImage ? (
                        <div className="w-full h-[40vh] md:h-[50vh] relative mt-0 overflow-hidden border-b border-white/10">
                            <Image
                                src={bannerImage}
                                alt={localTitle}
                                fill
                                className="object-cover object-center"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                                <div className="max-w-5xl mx-auto">
                                    {postData.category && (
                                        <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 font-semibold tracking-wide uppercase text-xs mb-4 backdrop-blur-md">
                                            {postData.category}
                                        </div>
                                    )}
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg leading-tight">
                                        {localTitle}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-gray-900 to-black border-b border-white/10">
                            <div className="max-w-5xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 font-semibold text-xs mb-6 uppercase tracking-wider">
                                    <FaMapMarkerAlt />
                                    Disponível em {city.name}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                                    {postData.title}
                                </h1>
                            </div>
                        </div>
                    )}

                    <div className="container mx-auto px-6 max-w-4xl py-16">
                        <div className="bg-white/5 rounded-3xl p-8 md:p-12 shadow-inner border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <PostIcon category={postData.category} />
                            </div>

                            {postData.public ? (
                                <div className="prose prose-lg prose-invert max-w-none
                                    prose-headings:text-white prose-h2:text-white prose-h3:text-white
                                    prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white
                                    prose-a:text-white hover:prose-a:text-gray-300 prose-a:underline prose-a:decoration-white/50
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
                                        {postData.content}
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
                                                    {postData.content}
                                                </ReactMarkdown>
                                            </div>
                                        </SignedIn>
                                    </ClientOnly>
                                </div>
                            )}
                        </div>
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

// Helper Icon Component
function PostIcon({ category }: { category?: string }) {
    // You can import icons and map them here if desired for the background watermark
    return (
        <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
    )
}

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

    return {
        props: {
            postData,
            seoSettings,
            city
        },
    };
};

export default CityCatalogItem;
