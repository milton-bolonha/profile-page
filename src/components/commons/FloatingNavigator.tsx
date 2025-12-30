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
};

export default function FloatingNavigator({ 
  config, 
  mode, 
  currentSlide,
  onNavigate,
  sections = []
}: FloatingNavigatorProps) {
  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Sync active section with current slide (horizontal) OR scroll spy (vertical)
  useEffect(() => {
    if (mode === 'horizontal') {
      // In horizontal mode, highlighted item is based on the current slide index
      if (sections[currentSlide]) {
        setActiveSection(sections[currentSlide]);
      }
    }
  }, [mode, currentSlide, sections]);

  // Scroll spy for Vertical Mode
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
      // In slideshow, we just tell the parent to switch slide
      // Use the index of this item in the items list, 
      // BUT we need the index of the SECTION in the page structure.
      // Assuming sections[] matches the order of config.items (or we search for ID)
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
  };

  if (!config?.enabled) return null;

  // Vertical placement
  const verticalClass = config.position === 'right' ? 'right-6 top-1/2 -translate-y-1/2 flex-col' : 'left-6 top-1/2 -translate-y-1/2 flex-col';
  
  // Horizontal placement
  const horizontalClass = 'bottom-6 left-1/2 -translate-x-1/2 flex-row';

  const containerClass = mode === 'horizontal' ? horizontalClass : verticalClass;

  return (
    <nav
      className={`fixed ${containerClass} z-[200]`} // Z-200 to be above everything
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
            
            // In horizontal mode, we need to map item.id to sections order
            // If item isn't in sections prop, it might be an external link? Assuming internal anchors.

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
