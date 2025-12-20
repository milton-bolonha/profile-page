import { MenuCloseIcon } from '@/components/icons/MenuCloseIcon';
import { ThemeToggle } from '@/components/commons/ThemeToggle';
import { LanguageSwitcher } from '@/components/commons/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CustomSignInButton } from "@/components/commons/clerk/SignInButton";
import { CustomSignOutButton } from "@/components/commons/clerk/SignOutButton";
import { UserButton } from "@clerk/nextjs";

// Importar SignedIn e SignedOut dinamicamente
// @ts-expect-error
const SignedIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedIn), { ssr: false });
// @ts-expect-error
const SignedOut = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedOut), { ssr: false });

interface MenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Menu = ({ isVisible, onClose }: MenuProps) => {
  const { t } = useLanguage();

  return (
    <div
      className={`${isVisible ? 'flex' : 'hidden'}
      fixed inset-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm md:hidden z-50
    `}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-gray-900 min-h-[400px] max-h-[90vh] overflow-y-auto shadow-md py-4 sm:py-5 px-4 sm:px-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-5 gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
            <Image
              src="/img/foto perfil.jpeg"
              alt="Guilherme Cirelli Lopes"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
            />
            <span className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate">
              Guilherme Cirelli
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
            <button onClick={onClose} aria-label={t('floatingButton.closeMenu')}>
              <MenuCloseIcon className="fill-gray-700 dark:fill-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </button>
          </div>
        </div>
        <nav className="flex flex-col gap-3 sm:gap-4 md:gap-5 text-base sm:text-lg md:text-xl px-2 sm:px-5 items-stretch sm:items-center">
          <Link
            href="/"
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {t('navigation.home')}
          </Link>
          <Link
            href="/sobre"
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {t('navigation.about')}
          </Link>
          <Link
            href="/projetos"
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {t('navigation.projects')}
          </Link>
          <Link
            href="/blog"
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {t('navigation.blog')}
          </Link>
          <Link
            href="/contato"
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {t('navigation.contact')}
          </Link>

          {/* Botões de Login */}
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
            <div className="mt-4 flex flex-col gap-3 items-center w-full">
              <SignedIn>
                <div className="flex items-center gap-3">
                  <UserButton />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('auth.loggedIn') || 'Logged in'}
                  </span>
                </div>
                <CustomSignOutButton />
              </SignedIn>
              
              <SignedOut>
                <CustomSignInButton />
              </SignedOut>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};
