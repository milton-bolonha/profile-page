import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPostSlugs, getPostData, PostData } from '@/lib/posts';
import { getSeoSettings } from '@/lib/seoSettings';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClientOnly } from '@/components/commons/ClientOnly';
import { CustomSignInButton } from "@/components/commons/clerk/SignInButton";
import Seo from '@/components/commons/Seo';
import dynamic from 'next/dynamic';

// Importar SignedIn e SignedOut dinamicamente para garantir que sejam renderizados apenas no cliente
// @ts-expect-error
const SignedIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedIn), { ssr: false });
// @ts-expect-error
const SignedOut = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedOut), { ssr: false });

interface PostProps {
  postData: PostData;
  seoSettings: any;
}

const Post = ({ postData, seoSettings }: PostProps) => {
  if (!postData) {
    return <div className="container mx-auto px-4 py-8">Carregando...</div>;
  }

  // Prepare SEO data
  const seoData = {
    title: postData.title,
    description: (postData as any).description || postData.content.substring(0, 160),
    keywords: (postData as any).keywords || [],
    author: postData.author,
    siteUrl: seoSettings.siteUrl,
    slug: `/posts/${postData.slug}`,
    articleUrl: `${seoSettings.siteUrl}/posts/${postData.slug}`,
    featuredImage: (postData as any).featuredImage || seoSettings.defaultImage,
    brandCardImage: seoSettings.brandCardImage,
    topology: 'post' as const,
    datePublished: postData.date,
    themeColor: seoSettings.themeColor,
    twitterHandle: seoSettings.twitterHandle,
    locale: seoSettings.locale,
  };

  const ImageRenderer = ({ node, ...props }: any) => {
    return (
      <div className="flex justify-center items-center mb-4">
        <Image 
          {...props} 
          alt="Post image"
          width={300}
          height={300}
          className="w-full h-auto max-w-[10rem] md:max-w-[12rem] lg:max-w-[14rem] rounded-lg shadow-lg" 
        />
      </div>
    );
  };

  const ParagraphRenderer = ({ node, ...props }: any) => {
    return (
      <p {...props} className="mb-4 leading-relaxed text-lg" />
    );
  };

  return (
    <>
      <Seo data={seoData} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">{postData.title}</h1>

        {postData.public ? (
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            <div className="md:w-1/2 flex flex-col items-center">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ImageRenderer,
                  p: ({ node, ...props }) => {
                    // Se o parágrafo contém apenas uma imagem, renderizar como div
                    if (node.children.length === 1 && node.children[0].type === 'image') {
                      return <ImageRenderer {...(node.children[0].props || {})} />;
                    }
                    return <ParagraphRenderer {...props} />;
                  },
                }}
              >
                {postData.content.split('\n').filter(line => line.startsWith('!')).join('\n')}
              </ReactMarkdown>
            </div>
            <div className="md:w-1/2 flex flex-col items-start">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ParagraphRenderer,
                  img: () => null, // Não renderizar imagens aqui
                }}
              >
                {postData.content.split('\n').filter(line => !line.startsWith('!')).join('\n')}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <>
            <ClientOnly>
              <SignedOut>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Access Denied!</strong>
                  <span className="block sm:inline"> This is a private post. Please log in to view it.</span>
                </div>
                <div className="mt-4 text-center">
                  <CustomSignInButton />
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
                  <div className="md:w-1/2 flex flex-col items-center">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        img: ImageRenderer,
                        p: ({ node, ...props }) => {
                          // Se o parágrafo contém apenas uma imagem, renderizar como div
                          if (node.children.length === 1 && node.children[0].type === 'image') {
                            return <ImageRenderer {...(node.children[0].props || {})} />; 
                          }
                          return <ParagraphRenderer {...props} />;
                        },
                      }}
                    >
                      {postData.content.split('\n').filter(line => line.startsWith('!')).join('\n')}
                    </ReactMarkdown>
                  </div>
                  <div className="md:w-1/2 flex flex-col items-start">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ParagraphRenderer,
                        img: () => null, 
                      }}
                    >
                      {postData.content.split('\n').filter(line => !line.startsWith('!')).join('\n')}
                    </ReactMarkdown>
                  </div>
                </div>
              </SignedIn>
            </ClientOnly>
          </>
        )}

        <p className="mt-8 text-center"><Link href="/" className="text-blue-500 hover:underline">Voltar para a Home</Link></p>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const postData = await getPostData(params?.slug as string);
  const seoSettings = getSeoSettings();
  
  return {
    props: {
      postData,
      seoSettings,
    },
  };
};

export default Post;
