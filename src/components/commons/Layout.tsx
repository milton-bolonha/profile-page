import { ReactNode } from 'react';
import { FloatingContactButton } from './FloatingContactButton';
import { GlobalClickFeedback } from '../ui/Animocon';
import { FloatingLanguageSelector } from './FloatingLanguageSelector';
// import { SectionNavigator } from './SectionNavigator';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      {/* <Footer /> Moved to Contact Section */}
      <FloatingLanguageSelector />
      <FloatingContactButton />
      {/* <SectionNavigator /> */}
      <GlobalClickFeedback />
      <style jsx global>{`
        body {
          background-color: #000000;
        }
      `}</style>
    </div>
  );
};
