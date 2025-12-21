"use client";

import { useState, useEffect } from "react";
import { PageSection } from "./PageSection";
import {
  Rocket,
  ScrollText,
  Globe,
  HeartHandshake,
  Atom,
  Plane,
  UserPlus,
  CheckCircle2,
  TrendingUp,
  Trophy,
  Bot,
} from "lucide-react";

type Category = "Todos" | "Origem" | "Carreira" | "Empreendedorismo" | "Futuro";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  detailedContent?: {
    achievements: string[];
    technologies?: string[];
    impact?: string;
  };
}

const timelineData: TimelineItem[] = [
  {
    year: "1998",
    title: "O Início da Jornada",
    description:
      "Com 11 anos, engenharia reversa de um site em HTML, CSS e JS dedicado ao anime Vegeta.",
    icon: Rocket,
    category: "Origem",
    detailedContent: {
      achievements: [
        "Primeiro contato com programação",
        "Engenharia reversa autodidata",
      ],
      technologies: ["HTML", "CSS", "JavaScript"],
      impact: "Descoberta da paixão pela tecnologia",
    },
  },
  {
    year: "1999",
    title: "Tratado de Bologna",
    description:
      "Assinatura do Tratado de Bologna pelo Presidente FHC, marcando o início de uma nova revolução industrial.",
    icon: ScrollText,
    category: "Origem",
    detailedContent: {
      achievements: ["Contexto histórico brasileiro"],
      impact: "Mudanças educacionais que influenciaram a formação",
    },
  },
  {
    year: "2005",
    title: "Era da Internet",
    description:
      "A revolução da internet transforma tudo. Aos 18 anos, já trabalhava com tecnologia há 2 anos.",
    icon: Globe,
    category: "Carreira",
    detailedContent: {
      achievements: [
        "Experiência prática em tecnologia",
        "Acompanhamento da revolução digital",
      ],
      technologies: ["Tecnologias web emergentes"],
      impact: "Base sólida para carreira profissional",
    },
  },
  {
    year: "2007-2009",
    title: "Serviços Filantrópicos",
    description:
      "Atuação voluntária de tempo integral em ensino e humanitários no nordeste brasileiro.",
    icon: HeartHandshake,
    category: "Carreira",
    detailedContent: {
      achievements: ["Ensino voluntário", "Trabalho humanitário"],
      impact: "Desenvolvimento de soft skills e propósito",
    },
  },
  {
    year: "2010-2018",
    title: "Revoluções Tecnológicas",
    description:
      "Diversas revoluções tecnológicas. As tecnologias web se tornam primordiais: 'A Web Venceu!'.",
    icon: Atom,
    category: "Carreira",
    detailedContent: {
      achievements: [
        "Acompanhamento de revoluções tech",
        "Especialização em web",
      ],
      technologies: ["Frameworks web", "APIs modernas"],
      impact: "Consolidação como especialista web",
    },
  },
  {
    year: "2018",
    title: "Mercado Internacional",
    description:
      "Início da jornada no mercado internacional. Lançamento do primeiro livro técnico.",
    icon: Plane,
    category: "Carreira",
    detailedContent: {
      achievements: ["Expansão internacional", "Publicação de livro técnico"],
      impact: "Reconhecimento internacional",
    },
  },
  {
    year: "2019",
    title: "O Aluno Zero",
    description:
      "O primeiro aluno solicita mentoria. Lançamento do primeiro MVP e participação em eventos de startup.",
    icon: UserPlus,
    category: "Empreendedorismo",
    detailedContent: {
      achievements: [
        "Primeira mentoria",
        "Lançamento MVP",
        "Eventos de startup",
      ],
      impact: "Início da jornada empreendedora",
    },
  },
  {
    year: "2019/2020",
    title: "Validação e MVP",
    description:
      "• Duas pesquisas de mercado\n• Validação no Techstarts Startup Weekend\n• 1º MVP\n• Atividades remuneradas iniciadas",
    icon: CheckCircle2,
    category: "Empreendedorismo",
    detailedContent: {
      achievements: [
        "Pesquisas de mercado",
        "Validação em competições",
        "Primeiro MVP",
        "Receita inicial",
      ],
      impact: "Prova de conceito validada",
    },
  },
  {
    year: "2021-2024",
    title: "Expansão e Sucesso",
    description:
      "• Receita de 70k USD\n• Consultoria para HapVida\n• Participação 100 Open Startups (Nível 3)",
    icon: TrendingUp,
    category: "Empreendedorismo",
    detailedContent: {
      achievements: [
        "Receita significativa",
        "Cliente corporativo",
        "Programa de aceleração",
      ],
      impact: "Crescimento e reconhecimento empresarial",
    },
  },
  {
    year: "2021-2024",
    title: "Reconhecimento",
    description:
      "• Destaque AC Boost 2022\n• Parceria Descola (Cubo Itaú)\n• Treinamento Anjos do Brasil",
    icon: Trophy,
    category: "Empreendedorismo",
    detailedContent: {
      achievements: [
        "Prêmios e reconhecimentos",
        "Parcerias estratégicas",
        "Programa de investidores",
      ],
      impact: "Validação externa do sucesso",
    },
  },
  {
    year: "2025",
    title: "Futuro Presente",
    description:
      "• Mentorias 'Trilha Ignição'\n• IA @goshDev\n• Expansão da rede de mentores",
    icon: Bot,
    category: "Futuro",
    detailedContent: {
      achievements: [
        "Programa de mentorias",
        "Desenvolvimento de IA",
        "Expansão da rede",
      ],
      technologies: ["Inteligência Artificial", "Machine Learning"],
      impact: "Futuro da educação tecnológica",
    },
  },
];

export default function HorizontalTimelineSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [selectedYear, setSelectedYear] = useState<string>("1998");
  const categories: Category[] = [
    "Todos",
    "Origem",
    "Carreira",
    "Empreendedorismo",
    "Futuro",
  ];

  // Filtrar itens baseado na categoria
  const filteredItems =
    selectedCategory === "Todos"
      ? timelineData
      : timelineData.filter((item) => item.category === selectedCategory);

  // Encontrar item selecionado
  const selectedItem =
    timelineData.find((item) => item.year === selectedYear) || timelineData[0];

  // Anos únicos para a timeline horizontal
  const timelineYears = Array.from(
    new Set(timelineData.map((item) => item.year))
  );

  return (
    <PageSection
      id="historia"
      title="Nossa História"
      titleSize="text-4xl md:text-6xl Geologica"
      subtitle="Uma jornada de mais de duas décadas transformando vidas através da tecnologia e mentoria"
      bgImage=""
      vPadding="py-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Layout em duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna 1: Filtros + Timeline Horizontal */}
          <div className="lg:col-span-1 space-y-8">
            {/* Filtros Inteligentes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Filtrar por Categoria
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-500 transform hover:scale-110 border backdrop-blur-sm ${
                      selectedCategory === cat
                        ? "bg-white text-black border-white shadow-2xl shadow-white/25"
                        : "bg-black/50 text-white/80 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Horizontal - Régua Visual */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Régua do Tempo
              </h3>
              <div className="relative p-6 bg-black/20 rounded-xl border border-white/10">
                {/* Régua principal com divisões */}
                <div className="relative mb-8">
                  {/* Linha principal da régua */}
                  <div className="h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20 rounded-full"></div>

                  {/* Marcas de centímetros/milímetros */}
                  <div className="absolute -top-2 left-0 right-0 flex justify-between">
                    {Array.from({ length: 21 }, (_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`h-4 w-0.5 bg-white/40 ${
                            i % 5 === 0 ? "h-6 bg-white/80" : ""
                          }`}
                        ></div>
                        {i % 5 === 0 && (
                          <span className="text-xs text-white/60 mt-1">
                            {Math.floor(i / 5) * 10}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Marcadores dos anos */}
                  <div className="absolute -top-6 left-0 right-0">
                    {timelineYears.map((year, index) => {
                      const isVisible = filteredItems.some(
                        (item) => item.year === year
                      );
                      const isSelected = selectedYear === year;

                      if (!isVisible && selectedCategory !== "Todos")
                        return null;

                      // Posição baseada no ano (1998 = 0%, 2025 = 100%)
                      const yearNum = parseInt(year);
                      const minYear = 1998;
                      const maxYear = 2025;
                      const position =
                        ((yearNum - minYear) / (maxYear - minYear)) * 100;

                      return (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={`absolute group transition-all duration-500 ${
                            isSelected ? "scale-150" : "hover:scale-125"
                          }`}
                          style={{
                            left: `${position}%`,
                            transform: "translateX(-50%)",
                          }}
                        >
                          {/* Marcador principal */}
                          <div className="relative">
                            <div
                              className={`w-4 h-4 rounded-full border-3 transition-all duration-500 shadow-lg ${
                                isSelected
                                  ? "bg-white border-white shadow-white/50"
                                  : "bg-black border-white/60 hover:border-white"
                              }`}
                            ></div>

                            {/* Indicador vertical */}
                            <div
                              className={`absolute top-4 left-1/2 w-0.5 h-6 bg-current transform -translate-x-1/2 transition-all duration-500 ${
                                isSelected
                                  ? "opacity-100"
                                  : "opacity-60 group-hover:opacity-100"
                              }`}
                            ></div>
                          </div>

                          {/* Tooltip com ano */}
                          <div
                            className={`absolute -top-12 left-1/2 transform -translate-x-1/2 text-sm font-bold transition-all duration-500 whitespace-nowrap ${
                              isSelected
                                ? "text-white opacity-100 scale-110"
                                : "text-white/60 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                            }`}
                          >
                            {year}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legenda da régua */}
                <div className="text-center text-xs text-white/50">
                  <div className="flex justify-between">
                    <span>1998</span>
                    <span>2025</span>
                  </div>
                  <p className="mt-2">
                    Clique nos marcadores para navegar pela história
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2-3: Conteúdo Detalhado */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 hover:border-white/30 transition-all duration-700 hover:shadow-white/10">
              {/* Header do item selecionado */}
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <selectedItem.icon size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-3xl font-bold text-primary">
                      {selectedItem.year}
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {selectedItem.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {selectedItem.title}
                  </h3>
                </div>
              </div>

              {/* Descrição principal */}
              <div className="text-muted-foreground leading-relaxed mb-8 text-lg">
                {selectedItem.description}
              </div>

              {/* Conteúdo detalhado se disponível */}
              {selectedItem.detailedContent && (
                <div className="space-y-6">
                  {/* Conquistas */}
                  {selectedItem.detailedContent.achievements && (
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">
                        Conquistas
                      </h4>
                      <ul className="space-y-2">
                        {selectedItem.detailedContent.achievements.map(
                          (achievement, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-3 text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {achievement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Tecnologias */}
                  {selectedItem.detailedContent.technologies && (
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">
                        Tecnologias
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.detailedContent.technologies.map(
                          (tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/5 text-primary text-sm font-medium rounded-full border border-primary/20"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Impacto */}
                  {selectedItem.detailedContent.impact && (
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">
                        Impacto
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedItem.detailedContent.impact}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
