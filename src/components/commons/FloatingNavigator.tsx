"use client";

import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaCode,
  FaEnvelope,
  FaGamepad,
  FaLaptopCode,
  FaClock,
  FaChartBar,
  FaQuestionCircle,
  FaFlask,
} from 'react-icons/fa';

interface NavigatorItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

interface NavigatorStyle {
  backgroundColor: string;
  activeColor: string;
  inactiveColor: string;
  hoverColor: string;
}

interface NavigatorConfig {
  enabled: boolean;
  position: 'right' | 'left';
  items: NavigatorItem[];
  style: NavigatorStyle;
}

interface FloatingNavigatorProps {
  config: NavigatorConfig;
  mode: "vertical" | "horizontal";
  currentSlide: number;
  onNavigate: (index: number) => void;
  sections?: string[]; // IDs of the sections in order
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  FaHome,
  FaUser,
  FaBriefcase,
  FaCode,
  FaEnvelope,
  FaGamepad,
  FaLaptopCode,
  FaClock,
  FaChartBar,
  FaQuestionCircle,
  FaFlask,
};

export default function FloatingNavigator({
  config,
  mode,
  currentSlide,
  onNavigate,
  sections = [],
  isMobile = false
}: FloatingNavigatorProps & { isMobile?: boolean }) {
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync active section with current slide (horizontal) OR scroll spy (vertical)
  useEffect(() => {
    if (mode === 'horizontal') {
      // In horizontal mode, highlighted item is based on the current slide index
      if (sections[currentSlide]) {
        setActiveSection(sections[currentSlide]);
      }
    }
  }, [mode, currentSlide, sections]);

  // Scroll spy for Vertical Mode (and Mobile if vertical?)
  useEffect(() => {
    if (mode === 'horizontal' || !config?.enabled) return;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    config.items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [config, mode]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, index: number) => {
    e.preventDefault();

    if (mode === 'horizontal') {
      // Horizontal behavior
      const targetId = href.replace('#', '');
      const slideIndex = sections.indexOf(targetId);

      if (slideIndex !== -1) {
        onNavigate(slideIndex);
      }
    } else {
      // Vertical smooth scroll
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsExpanded(false);
  };

  const handlePrev = () => {
    if (currentSlide > 0) onNavigate(currentSlide - 1);
  };

  const handleNext = () => {
    if (currentSlide < sections.length - 1) onNavigate(currentSlide + 1);
  };

  if (!config?.enabled) return null;

  // HIDE if on the 'ad-transition' / Showcase 3D slide
  if (sections[currentSlide] === 'ad-transition') {
    return null;
  }

  // Mobile Horizontal Mode (Special UI)
  if (isMobile && mode === 'horizontal') {
    const currentItem = config.items.find(item => item.id === activeSection) || config.items[0];
    const CurrentIcon = iconMap[currentItem.icon] || FaHome;

    return (
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-4">

        {/* Expanded Menu (popup) */}
        {isExpanded && (
          <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <ul className="grid grid-cols-4 gap-4">
              {config.items.map((item, index) => {
                const Icon = iconMap[item.icon] || FaHome;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href, index)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${isActive ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                      <Icon className="text-xl mb-1" />
                      <span className="text-[10px]">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Control Bar */}
        <div
          className="bg-black/80 backdrop-blur-md rounded-full border border-white/10 p-2 flex items-center gap-4 shadow-lg"
        >
          {/* Prev */}
          <button onClick={handlePrev} className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10">
            <svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Current Indicator */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black font-bold">
            <CurrentIcon className="text-xl" />
          </div>

          {/* Next */}
          <button onClick={handleNext} className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Expand Trigger */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-white/20 transition-all ${isExpanded ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
          >
            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    );
  }

  // Desktop / Vertical Logic (Original)
  const verticalClass = config.position === 'right' ? 'right-6 top-1/2 -translate-y-1/2 flex-col' : 'left-6 top-1/2 -translate-y-1/2 flex-col';
  const horizontalClass = 'bottom-6 left-1/2 -translate-x-1/2 flex-row';
  const containerClass = mode === 'horizontal' ? horizontalClass : verticalClass;

  return (
    <nav
      className={`fixed ${containerClass} z-[200]`}
    >
      <div
        className={`backdrop-blur-md rounded-full border border-white/5 shadow-md py-2 px-2 transition-all duration-300`}
        style={{
          backgroundColor: config.style.backgroundColor,
        }}
      >
        <ul className={`flex gap-2 ${mode === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
          {config.items.map((item, index) => {
            const Icon = iconMap[item.icon] || FaHome;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href, index)}
                  className="group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-0"
                  style={{
                    color: isActive ? config.style.activeColor : config.style.inactiveColor,
                  }}
                  title={item.label}
                >
                  <Icon className="text-sm transition-colors duration-300" />

                  {/* Tooltip */}
                  <span
                    className={`absolute ${mode === 'horizontal' ? 'bottom-full mb-2' : 'right-full mr-2'} px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                    style={{
                      backgroundColor: config.style.backgroundColor,
                      color: config.style.activeColor,
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-full border animate-pulse"
                      style={{
                        borderColor: config.style.activeColor,
                      }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
