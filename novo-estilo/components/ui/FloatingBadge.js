import React, { useState } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";

const badgeItems = [
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
    href: "/faq",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "Dúvidas frequentes",
  },
];

export default function FloatingBadge() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Badge clicked, current state:", isOpen);
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="fixed bottom-6 right-6"
      style={{
        zIndex: 9999,
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
      }}
    >
      {/* Main badge button */}
      <button
        onClick={handleToggle}
        className="w-14 h-14 bg-white rounded-full shadow-lg border-3 border-gray-200 hover:shadow-xl active:scale-95 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-300"
        style={{
          zIndex: 10000,
          position: "relative",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        aria-label={isOpen ? "Fechar menu de contato" : "Abrir menu de contato"}
        type="button"
      >
        {isOpen ? (
          <FaTimes className="text-gray-600 text-xl" />
        ) : (
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">!</span>
          </div>
        )}
      </button>

      {/* Badge items */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 space-y-3"
          style={{
            zIndex: 9998,
            position: "absolute",
            bottom: "4rem",
            right: "0",
            pointerEvents: "auto",
          }}
        >
          {badgeItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : "_self"}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : ""}
                className={`flex items-center bg-white rounded-full shadow-lg border-3 border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group ${
                  item.href === "/faq" ? "animate-pulse" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  pointerEvents: "auto",
                }}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="text-lg" />
                </div>

                {/* Label */}
                <div className="px-4 py-2 text-gray-700 font-medium whitespace-nowrap">
                  <div className="text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div
          className="absolute inset-0 w-14 h-14 bg-purple-500 rounded-full animate-ping opacity-20"
          style={{ pointerEvents: "none" }}
        ></div>
      )}
    </div>
  );
}
