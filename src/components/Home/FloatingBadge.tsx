import React, { useState } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaQuestionCircle,
  FaExclamation,
} from "react-icons/fa";

import { IconType } from "react-icons";

// Usando o react-icons como no original, mas agora em TSX
// Aumentando tamanhos e espaçamentos conforme solicitado

interface BadgeItem {
  icon: IconType;
  label: string;
  href: string;
  color: string;
  description: string;
}

const badgeItems: BadgeItem[] = [
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    href: "https://wa.me/5512981062959",
    color: "bg-green-500 hover:bg-green-600",
    description: "Fale conosco",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://instagram.com/instituto_organizacionista",
    color: "bg-pink-500 hover:bg-pink-600",
    description: "Siga-nos",
  },
  {
    icon: FaQuestionCircle,
    label: "FAQ",
    href: "/#faq", // Link âncora para a seção FAQ na home
    color: "bg-white hover:bg-white/90",
    description: "Dúvidas frequentes",
  },
];

const FloatingBadge = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999]"
      role="region"
      aria-label="Menu de contato flutuante"
    >
      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="absolute inset-0 w-16 h-16 bg-primary rounded-full animate-ping opacity-20 pointer-events-none" />
      )}

      {/* Main badge button */}
      <button
        onClick={handleToggle}
        className="relative z-[10000] w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border-4 border-gray-100 dark:border-gray-700 hover:shadow-xl active:scale-95 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30"
        aria-label={isOpen ? "Fechar menu de contato" : "Abrir menu de contato"}
        type="button"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black text-lg font-bold">!</span>
          </div>
        )}
      </button>

      {/* Badge items */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 space-y-4 z-[9998] min-w-[200px]">
          {badgeItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : "_self"}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : ""}
                className={`flex items-center justify-end group transition-all duration-300 transform hover:scale-105 ${
                  item.href.includes("faq") ? "animate-pulse-subtle" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Visual Label (Tooltip-like) */}
                <div className="mr-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-opacity duration-200 opacity-0 group-hover:opacity-100 absolute right-16 pointer-events-none whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-800 dark:text-white">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </div>
                </div>

                {/* Main Item Container */}
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-700 p-2 relative overflow-hidden">
                  {/* Icon Circle */}
                  <div
                    className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center text-white shadow-inner`}
                  >
                    <Icon className="text-2xl" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FloatingBadge;
