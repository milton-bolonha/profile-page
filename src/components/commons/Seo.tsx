import React from "react";
import Head from "next/head";

export interface SeoData {
  title: string;
  description: string;
  keywords?: string[];
  author: string;
  siteUrl: string;
  slug: string;
  articleUrl?: string;
  featuredImage?: string;
  brandCardImage?: string;
  topology?: 'post' | 'page';
  datePublished?: string;
  dateModified?: string;
  themeColor?: string;
  fbAppID?: string;
  adsAccount?: string;
  twitterHandle?: string;
  locale?: string;
}

interface SeoProps {
  children?: React.ReactNode;
  data?: SeoData | null;
}

const Seo: React.FC<SeoProps> = ({ children, data = null }) => {
  if (!data) {
    return (
      <Head>
        <title>NO SEO DATA</title>
      </Head>
    );
  }

  const {
    title,
    description,
    keywords,
    author,
    siteUrl,
    slug,
    articleUrl,
    featuredImage,
    brandCardImage,
    topology = 'page',
    datePublished,
    dateModified,
    themeColor = '#FF0081',
    fbAppID,
    adsAccount,
    twitterHandle = '@',
    locale = 'pt_BR',
  } = data;

  const canonicalUrl = `${siteUrl}${slug}`;
  const ogImage = featuredImage || brandCardImage || `${siteUrl}/img/og-image.jpg`;

  // Person Schema (for developer portfolio)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author,
    "url": siteUrl,
    "image": `${siteUrl}/img/perfil.jpeg`,
    "jobTitle": "Desenvolvedor Full Stack",
    "description": description,
    "sameAs": [
      "https://github.com/milton-bolonha",
      "https://www.linkedin.com/in/milton-bolonha",
      "https://www.upwork.com/freelancers/~01234567890abcdef" // Update with real URL
    ],
    "knowsAbout": [
      "Next.js",
      "React",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "Full Stack Development",
      "Web Development"
    ],
    "alumniOf": {
      "@type": "Organization",
      "name": "Your University" // Update with real data
    },
    "worksFor": {
      "@type": "Organization",
      "name": "21 Miles",
      "url": "https://21miles.com" // Update with real URL
    }
  };

  // Article Schema (for blog posts)
  const articleSchema = topology === 'post' ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": ogImage,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": author,
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": author,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": keywords?.join(', ')
  } : null;

  // WebSite Schema
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `${author} - Portfolio`,
    "url": siteUrl,
    "description": description,
    "inLanguage": locale.replace('_', '-'),
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "21 Miles",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "founder": {
      "@type": "Person",
      "name": author
    },
    "sameAs": [
      "https://github.com/milton-bolonha",
      "https://www.linkedin.com/in/milton-bolonha"
    ]
  };

  // ProfilePage Schema (for about/profile pages)
  const profilePageSchema = topology === 'page' && slug.includes('sobre') ? {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": personSchema,
    "dateCreated": datePublished,
    "dateModified": dateModified || datePublished,
    "description": description
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      ...(topology === 'post' ? [{
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      }, {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": canonicalUrl
      }] : [{
        "@type": "ListItem",
        "position": 2,
        "name": title,
        "item": canonicalUrl
      }])
    ]
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="index, follow" />
      <meta name="description" content={description} />
      <meta name="image" content={ogImage} />
      
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      <meta name="author" content={author} />
      <meta property="article:author" content={author} />
      <meta property="article:publisher" content={siteUrl} />
      
      {datePublished && (
        <>
          <meta name="publish_date" property="og:publish_date" content={datePublished} />
          <meta property="article:published_time" content={datePublished} />
        </>
      )}
      
      {dateModified && (
        <meta property="article:modified_time" content={dateModified} />
      )}

      {/* OpenGraph tags */}
      <meta property="og:type" content={topology === 'post' ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={`${author} - Portfolio`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      
      <meta name="theme-color" content={themeColor} />
      <link rel="canonical" href={canonicalUrl} />
      
      {fbAppID && (
        <meta property="fb:app_id" content={fbAppID} />
      )}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Schema.org JSON-LD tags */}
      <script
        type="application/ld+json"
        data-schema="Person"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      
      {articleSchema && (
        <script
          type="application/ld+json"
          data-schema="Article"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      
      <script
        type="application/ld+json"
        data-schema="WebSite"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      
      <script
        type="application/ld+json"
        data-schema="Organization"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgSchema),
        }}
      />

      {profilePageSchema && (
        <script
          type="application/ld+json"
          data-schema="ProfilePage"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profilePageSchema),
          }}
        />
      )}

      <script
        type="application/ld+json"
        data-schema="BreadcrumbList"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {adsAccount && adsAccount !== "" && (
        <meta name="google-adsense-account" content={adsAccount} />
      )}
      
      {children}
    </Head>
  );
};

export default Seo;
