import React from "react";
import Layout from "@/components/layout/Layout";
import LinkTreeCard from "@/components/ui/LinkTreeCard";
import { getLinkTreeData, getLogos, getBusinessSettings } from "@/lib/settings";

export default function Linktree({ links, logos, business }) {
  return (
    <Layout>
      <div className="max-w-xl mx-auto px-6 py-10 text-center">
        {logos?.markLogo ? (
          <img
            src={logos.markLogo}
            alt={business?.brandName || "Perfil"}
            className="mx-auto h-20 w-20 rounded-full"
          />
        ) : null}
        <h1 className="mt-4 text-2xl font-semibold">
          {business?.brandName || "Perfil"}
        </h1>
        <p className="mt-1 opacity-80">{business?.brandDescription}</p>
        <div className="mt-8 grid gap-3">
          {links?.linkTree?.map((l, i) => (
            <LinkTreeCard
              key={i}
              title={l.label}
              url={l.href}
              featured={i < 2}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const links = getLinkTreeData();
  const logos = getLogos();
  const business = getBusinessSettings();
  return { props: { links, logos, business } };
}
