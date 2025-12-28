import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Metatags essenciais */}
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" />

        {/* Metatags Open Graph padrão */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Milton Bolonha" />

        {/* Metatags Twitter padrão */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="bg-white dark:bg-gray-900">


        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
