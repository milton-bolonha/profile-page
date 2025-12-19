import React from "react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Clariana Abreu",
      role: "Web Developer",
      image: "/images/testimonial-1.jpg",
      text: "O Instituto Organizacionista tem excelentes profissionais e mentores de programação, ótima comunicação e muito ágeis para resolver problemas e passar seus conhecimentos. Tive o privilégio de ser aluna do I/O para a Upwork e obtive resultados incríveis de contrato na plataforma, recomendo bastante trabalhar com eles.",
    },
    {
      id: 2,
      name: "Ricardo Azevedo",
      role: "Desenvolvedor Full Stack",
      image: "/images/testimonial-2.jpg",
      text: "Antes não sabia nem por onde começar fora do Brasil. Com a mentoria, fechei meu primeiro contrato em dólar na Upwork em menos de 2 meses.",
    },
    {
      id: 3,
      name: "Juliana Costa",
      role: "UX Designer",
      image: "/images/testimonial-3.jpg",
      text: "Sempre sonhei em trabalhar para fora, mas não tinha ideia de como. O Instituto me ajudou a organizar portfólio e perfil, hoje recebo propostas internacionais direto.",
    },
    {
      id: 4,
      name: "Felipe Duarte",
      role: "DevOps",
      image: "/images/testimonial-4.jpg",
      text: "Eu achava que não tinha espaço pra DevOps no mercado internacional, mas com a orientação certa já tô faturando em dólar no Upwork.",
    },
    {
      id: 5,
      name: "Camila Rocha",
      role: "Analista de Dados",
      image: "/images/testimonial-5.jpg",
      text: "Graças à mentoria consegui meu primeiro cliente internacional. Ver o pagamento caindo em dólar na conta foi uma virada de chave total.",
    },
    {
      id: 6,
      name: "Thiago Martins",
      role: "Empreendedor Tech",
      image: "/images/testimonial-6.jpg",
      text: "O I/O me ajudou a validar minhas habilidades e montar estratégia de proposta. Hoje já atendo clientes dos EUA e Europa com segurança.",
    },
    {
      id: 7,
      name: "Fernanda Oliveira",
      role: "Desenvolvedora Back-end",
      image: "/images/testimonial-7.jpg",
      text: "Eu tinha medo de aplicar, achava que não estava pronta. A mentoria me deu confiança e estrutura, agora fecho contratos de até 3k dólares.",
    },
    {
      id: 8,
      name: "Bruno Lima",
      role: "Júnior em TI",
      image: "/images/testimonial-8.jpg",
      text: "Mesmo sem muita experiência, com a ajuda do Instituto Organizacionista consegui meu primeiro contrato remoto em dólar. Foi a melhor decisão que tomei.",
    },
    {
      id: 9,
      name: "Paula Mendes",
      role: "Tech Lead",
      image: "/images/testimonial-9.jpg",
      text: "O diferencial do I/O é que eles mostram o caminho na prática. Consegui contrato fixo internacional em menos de 3 meses.",
    },
    {
      id: 10,
      name: "André Souza",
      role: "Freelancer Full Stack",
      image: "/images/testimonial-10.jpg",
      text: "Eu trabalhava com freelas pequenos no Brasil. Depois da mentoria, organizei meu perfil e hoje só fecho projetos internacionais bem pagos.",
    },
  ];

  return (
    <div className="relative overflow-hidden mt-10">
      {/* Container dos testemunhos */}
      <div className="relative">
        {/* Gradiente lateral esquerdo */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #030014 0%, transparent 100%)",
          }}
        />

        {/* Gradiente lateral direito */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, #030014 0%, transparent 100%)",
          }}
        />

        {/* Primeira linha - esquerda para direita */}
        <div className="flex gap-6 mb-6 overflow-hidden">
          <div className="flex gap-6 animate-scroll-left">
            {[...testimonials.slice(0, 5), ...testimonials.slice(0, 5)].map(
              (testimonial, index) => (
                <div
                  key={`row1-${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Segunda linha - direita para esquerda */}
        <div className="flex gap-6 overflow-hidden">
          <div className="flex gap-6 animate-scroll-right">
            {[...testimonials.slice(5, 10), ...testimonials.slice(5, 10)].map(
              (testimonial, index) => (
                <div
                  key={`row2-${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
