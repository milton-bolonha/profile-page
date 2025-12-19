import React from "react";
import Layout from "@/components/layout/Layout";
import PagesContainer from "@/containers/PagesContainer";
import { getAllPageSlugs } from "@/lib/pages";

export default function PagesIndex({ slugs }) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Páginas</h1>
        <PagesContainer slugs={slugs} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const slugs = getAllPageSlugs();
  return {
    props: {
      slugs,
    },
  };
}
