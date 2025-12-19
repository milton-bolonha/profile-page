import React from "react";
import Layout from "@/components/layout/Layout";
import { getAllPageSlugs, getPageHtmlBySlug } from "@/lib/pages";
import PageTemplate from "@/components/ui/PageTemplate";

export default function StaticPage({ frontmatter, html }) {
  return (
    <Layout>
      <PageTemplate frontmatter={frontmatter} html={html} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getAllPageSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { frontmatter, html } = await getPageHtmlBySlug(params.slug);
  return { props: { frontmatter, html } };
}
