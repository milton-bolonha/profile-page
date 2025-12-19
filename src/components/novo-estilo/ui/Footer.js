import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer({
  logomark = "",
  companyName = "Instituto Organizacionista",
  description = "Transformando carreiras através de mentoria especializada",
  copyright = `© ${new Date().getFullYear()} Instituto Organizacionista. Todos os direitos reservados.`,
  socialLinks = {
    whatsapp: "https://wa.me/5512981062959",
    instagram: "https://instagram.com/instituto_organizacionista",
  },
  menuColumns = [
    {
      title: "Mentorias",
      links: [
        { label: "Trilha Ignição", href: "#cronograma" },
        { label: "Projeto Você StartUP", href: "#cronograma" },
        { label: "Cronograma", href: "#cronograma" },
        { label: "Nossos Números", href: "#estatisticas" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Nossa História", href: "#historia" },
        { label: "Comparativo", href: "#comparativo" },
        { label: "Testemunhos", href: "#sobre" },
        { label: "FAQ", href: "#faq" },
      ],
    },
  ],
  showNewsletter = false,
}) {
  const icons = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    github: FaGithub,
    youtube: FaYoutube,
    twitter: FaTwitter,
    whatsapp: FaWhatsapp,
  };

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t mt-16">
      {/* Pre-footer com frase inspiracional */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-6 italic">
                {`"Do nada, vem apenas o nada."`}
              </blockquote>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Se queremos determinar resultados, devemos lapidar
                <br />
                os nossos esforços, então aplicar o seguinte axioma:
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <p className="text-xl md:text-2xl font-semibold mb-4">
                  Trabalho, trabalho, trabalho, não existe
                  <br />
                  substituto satisfatório para o trabalho.
                </p>
                <p className="text-purple-300 font-medium">— M.B.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer principal */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="/images/logo-horizontal.png"
                alt={companyName}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {description}
            </p>
            <div className="flex gap-4 mb-6">
              {Object.entries(socialLinks).map(([key, href]) => {
                const Icon = icons[key.toLowerCase()];
                if (!Icon || !href) return null;
                return (
                  <a
                    key={key}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : "_self"}
                    rel={href.startsWith("http") ? "noopener noreferrer" : ""}
                    aria-label={key}
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-300 transform hover:scale-110"
                  >
                    <Icon className="text-xl text-gray-600 dark:text-gray-400" />
                  </a>
                );
              })}
            </div>

            {/* CTAs principais */}
            <div className="flex flex-col sm:flex-row gap-4">
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
                href="#contato"
                className="inline-flex items-center rounded-md border px-8 py-2 text-md font-semibold transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  color: "rgb(255,105,0)",
                  borderColor: "rgb(255,105,0)",
                }}
              >
                Seja Mentor/a
              </a>
            </div>
          </div>

          {menuColumns.map((col, idx) => (
            <div key={idx}>
              {col.title ? (
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  {col.title}
                </h3>
              ) : null}
              <ul className="space-y-3">
                {col.links?.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
