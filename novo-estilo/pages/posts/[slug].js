import React from "react";
import Layout from "@/components/layout/Layout";
import { getAllPostSlugs, getPostHtmlBySlug } from "@/lib/posts";
import PostTemplate from "@/components/ui/PostTemplate";

export default function PostPage({ frontmatter, html }) {
  return (
    <Layout>
      <PostTemplate frontmatter={frontmatter} html={html} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getAllPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { frontmatter, html } = await getPostHtmlBySlug(params.slug);
  return { props: { frontmatter, html } };
}
