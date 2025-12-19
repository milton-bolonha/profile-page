import React from "react";
import Layout from "@/components/layout/Layout";
import PlaygroundContainer from "@/containers/PlaygroundContainer";

export default function Playground() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Playground</h1>
        <PlaygroundContainer />
      </div>
    </Layout>
  );
}
