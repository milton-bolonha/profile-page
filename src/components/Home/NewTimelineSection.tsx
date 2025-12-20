import { useState } from "react";
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
  Bot 
} from "lucide-react";

type Category = "Todos" | "Origem" | "Carreira" | "Empreendedorismo" | "Futuro";

const timelineData = [
  {
    year: "1998",
    title: "O Início da Jornada",
    description:
      "Nosso CEO Milton Bolonha com 11 anos, por meio de engenharia reversa, faz um site em HTML, CSS e JS dedicado ao anti-herói de anime Vegetta.",
    icon: Rocket,
    category: "Origem"
  },
  {
    year: "1999",
    title: "Tratado de Bologna",
    description:
      "O então Presidente FHC firma o Tratado de Bologna, logo antes de uma nova revolução industrial.",
    icon: ScrollText,
    category: "Origem"
  },
  {
    year: "2005",
    title: "Era da Internet",
    description:
      "A era da internet revoluciona tudo. Na época nosso CEO já trabalhava há 2 anos com tecnologia.",
    icon: Globe,
    category: "Carreira"
  },
  {
    year: "2007-2009",
    title: "Serviços Filantrópicos",
    description:
      "Milton Bolonha prestou serviços filantrópicos de tempo integral, atuando com ensino e humanitários no nordeste brasileiro.",
    icon: HeartHandshake,
    category: "Carreira"
  },
  {
    year: "2010-2018",
    title: "Revoluções Tecnológicas",
    description:
      "Diversas revoluções, a maior delas foi que as tecnologias web se tornaram primordiais. A máxima prevalece 'A Web Venceu!'",
    icon: Atom,
    category: "Carreira"
  },
  {
    year: "2018",
    title: "Mercado Internacional",
    description:
      "Nosso CEO inicia a sua jornada de sucesso no mercado internacional. E começa a escrever o seu primeiro livro técnico.",
    icon: Plane,
    category: "Carreira"
  },
  {
    year: "2019",
    title: "O Aluno Zero",
    description:
      "O aluno zero pede para nosso CEO ensinar programação. Lançado primeiro MVP e começamos a participar de eventos de startup.",
    icon: UserPlus,
    category: "Empreendedorismo"
  },
  {
    year: "2019/2020",
    title: "Validação e MVP",
    description:
      "• Duas pesquisas de mercado\n• Validação na Techstarts Startup Weekend\n• 1º MVP\n• Início das atividades remuneradas",
    icon: CheckCircle2,
    category: "Empreendedorismo"
  },
  {
    year: "2021-2024",
    title: "Expansão e Sucesso",
    description:
      "• Marca de 70k USD em ganhos\n• Consultoria para a HapVida\n• Participação na 100 Open Startups (Nível 3)",
    icon: TrendingUp,
    category: "Empreendedorismo"
  },
  {
    year: "2021-2024",
    title: "Reconhecimento",
    description:
      "• Destaque na AC Boost 2022\n• Parceria com Descola (Cubo Itaú)\n• Participação e treinamento Anjos do Brasil",
    icon: Trophy,
    category: "Empreendedorismo"
  },
  {
    year: "2025",
    title: "Futuro Presente",
    description:
      "• Criada as mentorias 'Trilha Ignição'\n• Nasce a nossa Inteligência Artificial, @goshDev\n• Início da fase de expansão dos mentores",
    icon: Bot,
    category: "Futuro"
  },
];

export default function NewTimelineSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const categories: Category[] = ["Todos", "Origem", "Carreira", "Empreendedorismo", "Futuro"];

  // Filtrar itens
  const filteredItems = selectedCategory === "Todos" 
    ? timelineData 
    : timelineData.filter(item => item.category === selectedCategory);

  return (
    <PageSection
      id="historia"
      title="Nossa História"
      titleSize="text-4xl md:text-6xl"
      subtitle="Uma jornada de mais de duas décadas transformando vidas através da tecnologia e mentoria"
      bgImage=""
      vPadding="py-20"
    >
      {/* Filtro Inteligente */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 border ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-lg"
                : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Linha vertical central (apenas desktop) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>

        <div className="space-y-8 md:space-y-12">
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } group`}
              >
                {/* Conteúdo do card */}
                <div className={`w-full md:w-5/12 ${isLeft ? "md:pr-12" : "md:pl-12"} mb-6 md:mb-0`}>
                  <div className="bg-card dark:bg-card/40 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/30 group-hover:translate-y-[-2px]">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 text-primary shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary">
                          {item.year}
                        </div>
                        <div className="text-base font-semibold text-foreground leading-tight">
                          {item.title}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-[3.5rem]">
                      {item.description}
                    </div>
                  </div>
                </div>

                {/* Ponto central */}
                <div className="w-8 h-8 md:w-2/12 flex justify-center items-center z-10 my-2 md:my-0">
                  <div className="w-4 h-4 bg-background rounded-full border-2 border-primary shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                </div>

                {/* Espaço vazio para alternar (apenas desktop) */}
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>
    </PageSection>
  );
}
