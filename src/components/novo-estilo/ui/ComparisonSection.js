import React from "react";
import PageSection from "./PageSection";

const comparisonData = [
  {
    category: "Tipo",
    alura: "Cursos On-line",
    io: "Mentoria Individual",
  },
  {
    category: "Pedagogia",
    alura: "Livres e Massivos",
    io: "Construtiva",
  },
  {
    category: "Recurso Principal",
    alura: "Vídeo-aulas",
    io: "Mentores",
  },
  {
    category: "Acompanhamento",
    alura: "Não",
    io: "Sim",
  },
  {
    category: "Preço Entrada",
    alura: "Alto",
    io: "Acessível",
  },
  {
    category: "Carreira Internacional",
    alura: "Sim",
    io: "Sim, especializado",
  },
  {
    category: "Especializado em TI",
    alura: "Sim",
    io: "Sim",
  },
  {
    category: "Especializado Freela e Startup",
    alura: "Não/Não",
    io: "Sim/Sim",
  },
];

export default function ComparisonSection() {
  return (
    <PageSection
      id="comparativo"
      title="Comparativo"
      isFullHeight
      backgroundSize="unset"
      titleSize="text-4xl md:text-6xl"
      subtitle="Veja por que nossa abordagem de mentoria individual é mais eficaz<br />que cursos massivos"
      bgImage="images/bg-3.jpg"
      vPadding="pt-60 pb-20 bg-no-repeat"
      ctaBtnText="Fale Com Um/a Mentor/a"
      ctaBtnLink="https://wa.me/5512981062959"
      ctaContrastBtnText="Seja Mentor/a"
      ctaContrastBtnLink="#contato"
      ctaContrastBtnPosition="center"
      ctaBtnColor="rgb(255,105,0)"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mb-10">
        <div className="overflow-x-auto ">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-6 py-4 text-left font-semibold">Categoria</th>
                <th className="px-6 py-4 text-left font-semibold">Alura</th>
                <th className="px-6 py-4 text-left font-semibold">I/O</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-700"
                  } hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors`}
                >
                  <td className="px-6 py-4 font-semibold text-purple-600 dark:text-purple-400">
                    {row.category}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {row.category === "Acompanhamento" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        {row.alura}
                      </span>
                    ) : (
                      row.alura
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {row.category === "Acompanhamento" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {row.io}
                      </span>
                    ) : (
                      row.io
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="mt-12 text-center">
        <a
          href="https://wa.me/5512981062959"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md px-8 py-2 text-md font-semibold transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: "rgb(255,105,0)", color: "#000000" }}
        >
          Fale Com Um/a Mentor/a
        </a>
        <a
          href="https://wa.me/5512981062959"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md px-8 py-2 text-md font-semibold transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: "rgb(255,105,0)", color: "#000000" }}
        >
          Fale Com Um/a Mentor/a
        </a>
      </div> */}
    </PageSection>
  );
}
