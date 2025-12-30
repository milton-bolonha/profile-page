"use client";

import React, { useState, useEffect, ReactNode } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

// ============================================================================
// INTERFACES
// ============================================================================

export interface TabButton {
  text: string;
  link?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary';
  icon?: React.ComponentType<any>;
}

export interface TabContent {
  type: 'slideshow' | 'game' | 'placeholder';
  // Para slideshow
  slides?: Array<{
    bg: string;
    fg: string;
  }>;

  buttons?: TabButton[];
  // Para game
  gameComponent?: ReactNode;
  // Para placeholder
  placeholderIcon?: React.ComponentType<any>;
  placeholderTitle?: string;
  placeholderDescription?: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  content: TabContent;
}

export interface ExperienceShowcaseProps {
  badge?: string;
  title: string;
  description: string;
  tabs: Tab[];
  defaultTab?: string;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface ActionButtonProps {
  button: TabButton;
}

function ActionButton({ button }: ActionButtonProps) {
  const Icon = button.icon;
  const isPrimary = button.variant === 'primary';

  const handleClick = () => {
    if (button.onClick) {
      button.onClick();
    } else if (button.link) {
      window.open(button.link, '_blank');
    }
  };

  return (
    <MagneticButton
      onClick={handleClick}
      className={`
        group relative inline-flex items-center gap-3 font-medium py-4 px-8 rounded-full 
        transition-all duration-300 cursor-pointer
        ${isPrimary 
          ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]' 
          : 'bg-black/10 backdrop-blur-md text-white border border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] shadow-[0_0_20px_rgba(0,0,0,0.6)]'
        }
      `}
    >
      <span className={`relative z-10 tracking-widest text-sm font-bold ${isPrimary ? '' : 'pt-[2px]'}`}>
        {button.text}
      </span>
      {Icon && <Icon className="w-4 h-4 relative z-10 text-white" />}
    </MagneticButton>
  );
}

interface SlideshowContentProps {
  slides: Array<{ bg: string; fg: string }>;
  currentSlide: number;

  buttons?: TabButton[];
}

function SlideshowContent({ slides, currentSlide, buttons }: SlideshowContentProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* SLIDESHOW LAYER */}
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`absolute w-full h-full transition-opacity duration-[2000ms] ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ pointerEvents: 'none' }}
        >
          {/* Background Image (Blurred & Darkened) */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
            style={{ 
              backgroundImage: `url(${slide.bg})`, 
              filter: 'brightness(0.3) blur(8px)',
            }}
          />
          
          {/* Central Box Image (Sharp & Glowing) */}
          <div className="absolute inset-x-20 top-20 bottom-0 flex items-center justify-center">
            <div className="w-[85%] h-[200px] relative border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.15)] overflow-hidden rounded-xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${slide.fg})`,
                  transition: 'transform 6s ease-out',
                  transform: currentSlide === index ? 'scale(1.05)' : 'scale(1.0)' 
                }}
              />
              {/* Vignette */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 opacity-60" />
            </div>
          </div>
        </div>
      ))}

      {/* CONTENT LAYER */}
      <div className="relative z-20 mt-24 md:mt-72 flex flex-col items-center gap-4">

        
        {/* Buttons */}
        {buttons && buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-6">
            {buttons.map((button, idx) => (
              <ActionButton key={idx} button={button} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface GameContentProps {
  gameComponent: ReactNode;
}

function GameContent({ gameComponent }: GameContentProps) {
  return (
    <div className="w-full h-full">
      {gameComponent}
    </div>
  );
}

interface PlaceholderContentProps {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
}

function PlaceholderContent({ icon: Icon, title, description }: PlaceholderContentProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 min-h-[500px]">
      <div className="text-center p-12 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm max-w-2xl w-full">
        {Icon && <Icon className="text-6xl mb-6 mx-auto opacity-50 block" />}
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-white/60">{description}</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExperienceShowcase({
  badge = "+20 Anos de Experiência",
  title,
  description,
  tabs,
  defaultTab,
}: ExperienceShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const slides = activeTabData?.content.slides || [];

  // Handle Page Visibility to prevent animation stacking
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Slideshow Interval (Pauses if game active or page hidden or not slideshow)
  useEffect(() => {
    if (isGameActive || !isPageVisible || activeTabData?.content.type !== 'slideshow' || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isGameActive, isPageVisible, activeTabData, slides.length]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden">
      {/* HEADER & TABS CONTAINER */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
        
        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide uppercase">
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-4xl md:text-5xl text-white font-semibold mb-4" style={{ fontFamily: 'Noto Serif Variable, serif' }}>
          {title}
        </h2>
        
        {/* Description */}
        <p className="text-lg text-white/60 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
          {description}
        </p>

        {/* Tabs / Selectors */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsGameActive(false); 
                }}
                className={`
                  px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-3 cursor-pointer border
                  ${activeTab === tab.id 
                    ? 'bg-white text-black border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'}
                `}
              >
                <Icon className="text-lg" />
                <span className="tracking-wide uppercase text-sm font-semibold pt-[2px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[600px] -mt-[100px]">
        {activeTabData && (
          <div className="w-full h-full absolute inset-0">
            {/* SLIDESHOW CONTENT */}
            {activeTabData.content.type === 'slideshow' && !isGameActive && (
              <SlideshowContent 
                slides={slides}
                currentSlide={currentSlide}

                buttons={activeTabData.content.buttons}
              />
            )}

            {/* GAME CONTENT */}
            {activeTabData.content.type === 'game' && isGameActive && activeTabData.content.gameComponent && (
              <GameContent gameComponent={activeTabData.content.gameComponent} />
            )}

            {/* PLACEHOLDER CONTENT */}
            {activeTabData.content.type === 'placeholder' && (
              <PlaceholderContent 
                icon={activeTabData.content.placeholderIcon}
                title={activeTabData.content.placeholderTitle || 'Em Breve'}
                description={activeTabData.content.placeholderDescription || 'Conteúdo em desenvolvimento'}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
