import React, { useState } from "react";
import PageSection from "@/components/ui/PageSection";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import TopRibbon from "@/components/ui/TopRibbon";

export default function PlaygroundContainer() {
  const [title, setTitle] = useState("Título da Seção");
  return (
    <div className="space-y-8">
      <TopRibbon messages={["Mensagem 1", "Mensagem 2"]} />
      <Header />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1 border rounded p-4">
            <div className="font-medium mb-2">Props</div>
            <label className="block text-sm mb-1">Título</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <PageSection title={title} numColumns={3}>
              <div className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded" />
              <div className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded" />
              <div className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded" />
            </PageSection>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
