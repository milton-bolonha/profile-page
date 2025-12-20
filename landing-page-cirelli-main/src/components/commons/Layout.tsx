import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContactButton } from './FloatingContactButton';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <FloatingContactButton />
    </div>
  );
};
