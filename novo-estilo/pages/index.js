import React from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import PageSection from "@/components/ui/PageSection";
import StoriesSection from "@/components/ui/StoriesSection";
import TestimonialsSection from "@/components/ui/TestimonialsSection";
import StatsSection from "@/components/ui/StatsSection";
import TimelineSection from "@/components/ui/TimelineSection";
import ComparisonSection from "@/components/ui/ComparisonSection";
import ScheduleSection from "@/components/ui/ScheduleSection";
import FAQSection from "@/components/ui/FAQSection";
import FloatingBadge from "@/components/ui/FloatingBadge";
import { getFeaturedPosts, getAllPosts } from "@/lib/posts";
import PostCard from "@/components/ui/PostCard";
import FeatureBox from "@/components/ui/FeatureBox";

export default function Home({ featured, recent }) {
  return (
    <Layout>
      <PageSection
        id="home"
        title="Revolucione!"
        titleSize="text-4xl md:text-6xl"
        subtitle="Nossos mentores vão te equipar para o sucesso<br />no novo mercado de trabalho."
        ctaBtnText="Fale Com Um/a Mentor/a"
        ctaBtnLink="https://wa.me/5512981062959"
        ctaContrastBtnText="Seja Mentor/a"
        ctaContrastBtnLink="#contato"
        ctaContrastBtnPosition="center"
        ctaBtnColor="rgb(255,105,0)"
        isFullHeight
        fullHeightSubtract="10vh"
        vPadding="py-20"
        maxWidth="max-w-[550px]"
        bgImage="images/main-bg.jpg"
      />

      <section id="mentoria">
        <StoriesSection />
      </section>

      {/* Seção de Estatísticas */}
      <StatsSection />

      {/* Seção de Timeline */}
      <TimelineSection />

      {/* Seção de Comparativo */}
      <ComparisonSection />

      {/* Seção de Cronograma */}
      <ScheduleSection />

      {/* Seção FAQ */}
      <FAQSection />

      <PageSection
        id="sobre"
        title="Testemunhos Reais"
        titleSize="text-4xl md:text-6xl"
        subtitle="Após mudarmos as vidas de pessoas simples, impactando de forma real, nossos mentorados conquistam os seus cliente e seus próprios testemunhos."
        tagline="O Que Estão Dizendo"
        isFullHeight
        vPadding="pt-60"
        bgImage="images/bg-1.jpg"
      >
        <TestimonialsSection />
      </PageSection>

      <PageSection
        id="contato"
        title="Agende A Sua Primeira Mentoria"
        titleSize="text-6xl relative -top-40 mt-44"
        tagline="Comece pelo básico"
        isFullHeight
        vPadding="py-20 pt-30"
        bgImage="images/bg-2.jpg"
      >
        <div className="relative -top-20 mb-20 pb-40 mt-4">
          <div className="flex flex-col items-center justify-center relative -top-20">
            <h2
              className="Geologica text-6xl font-medium"
              style={{ color: "#c54dff" }}
            >
              Agende Já
            </h2>
            <ul
              className="Inter grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 mt-6  "
              style={{ color: "#F4F0FF", fontSize: "16px" }}
            >
              <li>Aprenda com o nosso método</li>
              <li>Equipe-se com ferramentas</li>
              <li>Sessão de degustação grátis</li>
              <li>Acesse o nosso catálogo</li>
              <li>Conheça os nossos planos</li>
              <li>Ganhe brindes e descontos</li>
            </ul>
            <a
              href="https://wa.me/5512981062959"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-md px-8 py-3 font-semibold cursor-pointer"
              style={{ backgroundColor: "#6949B1", color: "#FFFFFF" }}
            >
              Fale Com Um/a Mentor/a
            </a>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="planos"
        title="Receba Super Poderes"
        titleSize="text-4xl md:text-6xl"
        subtitle="Você aprenderá habilidades diversas, receberá tecnologia de ponta gratuita e terá a disposição ferramentas para lucrar com os seus novos superpoderes."
        isFullHeight
        vPadding="pt-60"
        bgImage="images/bg-3.jpg"
        backgroundSize="unset"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <FeatureBox
            title="O Que Não Entregamos"
            paragraph={
              "Diferentemente dos Cursos On-Line Massivos  (MOOC’s),<br />nos empenhamos de forma humanizada. E com experiência, nós garantimos o seu sucesso!"
            }
            items={[
              "Vídeo-Aulas e Material Desatualizado",
              "Tecnologias e Mercado Antigo",
              "Falta de Resultados Práticos",
              "Falta de Acompanhamento Individual",
              "Excesso de Carga Horária",
              "Material Didático, Livros e Mais...",
            ]}
            itemBg="red"
          />
          <FeatureBox
            title="O Que Te Entregamos"
            paragraph={
              "Contratamos as melhores pessoas profissionais, experts naquilo que fazem, treinamos e equipamos com os mais modernos materiais de mentoria do mundo."
            }
            items={[
              "Mentoria Semanal Especializada",
              "Tecnologia de Ponta",
              "Manuais Exclusivos, Métodos Comprovados",
              "Inteligência Artificial Ilimitada",
              "Métodos Inclusivos e Humanizados",
              "Material Didático, Livros e Mais...",
            ]}
            itemBg="green"
          />
        </div>
      </PageSection>

      {/* Badge flutuante */}
      <FloatingBadge />

      {/* <PageSection title="Posts em destaque" numColumns={3}>
        {featured.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </PageSection> */}

      {/* <PageSection title="Posts recentes" numColumns={3}>
        {recent.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </PageSection> */}
    </Layout>
  );
}

export async function getStaticProps() {
  const featured = getFeaturedPosts(3);
  const recent = getAllPosts().slice(0, 6);
  return { props: { featured, recent } };
}
