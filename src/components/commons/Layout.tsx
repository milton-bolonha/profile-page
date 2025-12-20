import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContactButton } from './FloatingContactButton';
import { GlobalClickFeedback } from '../ui/Animocon';
import { SectionNavigator } from './SectionNavigator';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingContactButton />
      <SectionNavigator />
      <GlobalClickFeedback />
    </div>
  );
};
