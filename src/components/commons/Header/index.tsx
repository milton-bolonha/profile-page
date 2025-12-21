"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from './Menu';
import { useCallback, useState } from 'react';
import { MenuIcon } from '@/components/icons/MenuIcon';
import { UserButton } from "@clerk/nextjs";
import dynamic from 'next/dynamic';
import { CustomSignInButton } from "@/components/commons/clerk/SignInButton";
import { CustomSignOutButton } from "@/components/commons/clerk/SignOutButton";
import { useRouter } from 'next/router';
import { ThemeToggle } from '@/components/commons/ThemeToggle';
import { LanguageSwitcher } from '@/components/commons/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMainMenu, getLogos } from '@/lib/settings';

// Importar SignedIn e SignedOut dinamicamente para garantir que sejam renderizados apenas no cliente
const SignedIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedIn), { ssr: false });
const SignedOut = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedOut), { ssr: false });

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const mainMenu = getMainMenu();
  const logos = getLogos();

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header
      className="bg-black text-sm flex py-3 px-5 justify-between items-center sticky top-0 z-20"
    >
      {/* Download Resume Button */}
      <div className="flex items-center">
        <a
          href="/files/Curriculo 02072025.pdf"
          download="Curriculo_Guilherme_Cirelli.pdf"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('download.resume')}
        </a>
      </div>

      {/* Mobile menu button */}
      <button className="p-1 md:hidden" onClick={openMenu}>
        <MenuIcon className="fill-gray-700 dark:fill-white w-8 h-8" />
      </button>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-2 text-md">
        <Link
          href="/"
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            router.pathname === '/'
              ? 'bg-blue-600 text-white'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          {t('navigation.home')}
        </Link>
        <Link
          href="/sobre"
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            router.pathname === '/sobre'
              ? 'bg-blue-600 text-white'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          {t('navigation.about')}
        </Link>
        <div className="relative group">
          <Link
            href="/projetos"
            className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-1 ${
              router.pathname === '/projetos'
                ? 'bg-blue-600 text-white'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            {t('navigation.projects')}
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          
          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-0 w-48 bg-gray-900 rounded-lg shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
            <div className="py-2">
              <Link 
                href="/projetos?category=Web App" 
                className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                Web Apps
              </Link>
              <Link 
                href="/projetos?category=E-commerce" 
                className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                E-commerce
              </Link>
              <Link 
                href="/projetos?category=Landing Page" 
                className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                Landing Pages
              </Link>
              <Link 
                href="/projetos?category=Backend" 
                className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                Backend
              </Link>
            </div>
          </div>
        </div>
        <Link
          href="/blog"
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            router.pathname === '/blog'
              ? 'bg-blue-600 text-white'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          {t('navigation.blog')}
        </Link>
        <Link
          href="/contato"
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            router.pathname === '/contato'
              ? 'bg-blue-600 text-white'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          {t('navigation.contact')}
        </Link>
      </nav>

      {/* Right side actions */}
      <div className="hidden md:flex items-center gap-4">
        <LanguageSwitcher />
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
          <>
            <SignedIn>
              <UserButton />
              <CustomSignOutButton />
            </SignedIn>
           
            <SignedOut>
              <CustomSignInButton />
            </SignedOut>
          </>
        )}
      </div>

      <Menu isVisible={isMenuOpen} onClose={closeMenu} />
    </header>
  );
};
