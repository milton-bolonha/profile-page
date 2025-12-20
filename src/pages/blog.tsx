import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBusinessSettings, getGeneralSettings } from '@/lib/settings';
import { PageSection } from '@/components/commons/PageSection';
import { useUser, SignInButton } from "@clerk/nextjs";
import { ClientOnly } from '@/components/commons/ClientOnly';

interface BlogProps {
  businessSettings: any;
  generalSettings: any;
}

// ... imports

// Componente auxiliar para usar o hook do Clerk com segurança
const WithClerk = ({ children, onLoaded }: any) => {
  const { isSignedIn, isLoaded, user } = useUser();
  useEffect(() => {
    onLoaded({ isSignedIn, isLoaded, user });
  }, [isSignedIn, isLoaded, user, onLoaded]);
  return <>{children}</>;
}

const BlogContent = ({ businessSettings, generalSettings }: BlogProps) => {
  const { t } = useLanguage();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasClerkKey, setHasClerkKey] = useState(false);

  useEffect(() => {
    setHasClerkKey(!!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    // Se não tiver chave, assume que está carregado e não logado
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      setIsLoaded(true);
    }
  }, []);

  const handleClerkState = (state: any) => {
    setIsSignedIn(state.isSignedIn);
    setIsLoaded(state.isLoaded);
  };

  // Se tiver chave do Clerk, usa o hook
  const content = (
    <>
      {hasClerkKey && (
         <WithClerk onLoaded={handleClerkState} />
      )}
      {/* ... logica de renderização que depende do estado ... */}
      {/* Como o blog original tinha lógica de loading e login, precisamos adaptar */}
    </>
  );
  
  // Adaptando a lógica original:
  
  // 1. Se tem chave e ainda não carregou: Loading
  if (hasClerkKey && !isLoaded) {
    return (
      <>
        <WithClerk onLoaded={handleClerkState} />
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">{t('blog.exclusive.loading')}</p>
            </div>
        </div>
      </>
    );
  }

  // 2. Se não está logado (seja pq não tem chave ou pq não logou): Mostra Login (se tiver chave) ou Aviso (se não tiver)
  // O blog era "Exclusivo", então se não tem chave, o que mostrar?
  // Se não tem chave, não dá pra logar. Devemos mostrar o blog aberto ou fechado?
  // Assumindo que num portfolio público sem chave deve-se MOSTRAR o contúdo,
  // ou mostrar aviso que precisa de env vars.
  // Vou assumir que sem chave = mostra conteúdo (fallback seguro) ou mostra aviso de configuração.
  // Melhor: Se não tem chave, mostra o conteúdo com aviso de "Demo Mode" ou simplesmente mostra.
  // O código original bloqueava tudo se !isSignedIn.
  
  // Vamos preservar a lógica: Bloqueia se não logado.
  // Mas se não tem chave, não dá pra logar.
  // Vou permitir ver o blog se não tiver chave (modo demo) OU bloquear com msg de erro.
  // Decisão: Permitir ver se não tiver chave (para não quebrar a demo do portfolio).
  
  const showContent = isSignedIn || !hasClerkKey;

  if (!showContent) {
    return (
       <>
        <WithClerk onLoaded={handleClerkState} />
        <Head>
          <title>Blog | {businessSettings.brandName}</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('blog.exclusive.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('blog.exclusive.message')}
            </p>
            <SignInButton mode="modal">
              <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                {t('blog.exclusive.loginButton')}
              </button>
            </SignInButton>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {hasClerkKey && (
         <WithClerk onLoaded={handleClerkState} />
      )}
      <Head>
        <title>Blog | {businessSettings.brandName}</title>
        <meta
          name="description"
          content={`Timeline da carreira de ${businessSettings.brandName} - Desenvolvedor web`}
        />
        <meta property="og:title" content={`Blog | ${businessSettings.brandName}`} />
        <meta property="og:description" content={`Timeline da carreira de ${businessSettings.brandName} - Desenvolvedor web`} />
      </Head>

      <div className="min-h-screen">
        <PageSection
          title={t('blog.title')}
          subtitle={t('blog.subtitle')}
          vPadding="py-20"
        >
          <div className="col-span-full">
            <div className="max-w-4xl mx-auto">
              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800"></div>
                
                {/* Timeline items */}
                <div className="space-y-12">
                  {Array.isArray(t('blog.timeline')) && t('blog.timeline').map((item: any, index: number) => (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline dot */}
                      <div className="absolute left-6 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>
                      
                      {/* Content */}
                      <div className="ml-16 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                            {item.date}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('blog.cta.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  {t('blog.cta.description')}
                </p>
                <Link
                  href="/contato"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {t('blog.cta.button')}
                </Link>
              </div>
            </div>
          </div>
        </PageSection>
      </div>
    </>
  );
};

const Blog = (props: BlogProps) => {
  return (
    <ClientOnly>
      <BlogContent {...props} />
    </ClientOnly>
  );
};

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const businessSettings = getBusinessSettings();
  const generalSettings = getGeneralSettings();

  return {
    props: {
      businessSettings,
      generalSettings,
    },
  };
};

export default Blog;
