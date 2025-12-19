import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi";

const MENU = [
  { label: "Home", href: "#home" },
  { label: "Mentorias", href: "#mentoria" },
  { label: "Como Funciona", href: "#cronograma" },
  { label: "FAQ", href: "#faq" },
];

export default function Header({
  logoImage = "",
  logoText = "IO",
  logoFontStyle = "font-semibold",
  logoAlign = "left",
  showMainMenu = true,
  headerHeight = 80,
  isTransparent = false,
  stickyHeader = true,
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onResize = () => setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const themeIsDark = mounted && (resolvedTheme || theme) === "dark";

  return (
    <header
      className={
        "w-full z-40 relative " +
        (stickyHeader ? "sticky top-0" : "") +
        " " +
        "bg-white/40 dark:bg-black/20 backdrop-blur border-b border-white/20 dark:border-white/10"
      }
      style={{ height: headerHeight, "--header-height": `${headerHeight}px` }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Página inicial"
        >
          <img
            src="/images/logo-mobile.png"
            alt={logoText}
            className="h-8 w-auto md:hidden"
          />
          <img
            src="/images/logo-horizontal.png"
            alt={logoText}
            className="h-8 w-auto max-w-[350px] hidden md:block"
          />
        </Link>

        <nav
          className="hidden md:flex items-center gap-6 bg-white/5 border border-white/10 rounded-full px-4 py-2"
          aria-label="Menu principal"
        >
          {showMainMenu &&
            MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="opacity-90 hover:opacity-100 text-sm"
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#login"
            className="text-sm px-3 py-1 rounded border border-transparent hover:border-current"
          >
            Login
          </a>
          <a
            href="#loja"
            className="text-sm px-3 py-1 rounded border border-current"
          >
            Ir Pra Loja
          </a>
          {/* <button
            aria-label="Alternar tema"
            onClick={() => setTheme(themeIsDark ? "light" : "dark")}
            className="p-2 rounded focus-visible:outline focus-visible:outline-2"
          >
            {!mounted ? (
              <div className="w-5 h-5" />
            ) : themeIsDark ? (
              <FiSun aria-hidden />
            ) : (
              <FiMoon aria-hidden />
            )}
          </button> */}
          <button
            className="md:hidden p-2"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={
          (open ? "block" : "hidden") +
          " md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-white/20 dark:border-white/10 shadow-lg"
        }
      >
        <nav
          className="px-6 py-4 flex flex-col gap-1"
          aria-label="Menu principal (mobile)"
        >
          {showMainMenu &&
            MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

          {/* Botões de ação no mobile */}
          <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
            <a
              href="#login"
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors"
              onClick={() => setOpen(false)}
            >
              Login
            </a>
            <a
              href="#loja"
              className="text-sm px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-center transition-colors"
              onClick={() => setOpen(false)}
            >
              Ir Pra Loja
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
