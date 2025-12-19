import React, { useState } from "react";

export default function StoryCard({ image, alt, isSelected, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${isSelected ? "scale-110 z-10" : "scale-100"}
        ${isHovered ? "scale-105 z-5" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Card principal */}
      <div
        className={`
        relative rounded-2xl shadow-lg
        transition-all duration-300 ease-out
        ${isSelected ? "shadow-2xl ring-4 ring-white" : "shadow-lg"}
        ${isHovered ? "shadow-xl" : ""}
      `}
      >
        <img
          src={image}
          alt={alt}
          className={`
            w-full h-auto object-cover transition-transform duration-300
            ${isSelected ? "scale-105" : ""}
            ${isHovered ? "scale-102" : ""}
          `}
        />

        {/* Overlay preto de 10% quando não selecionado */}
        {!isSelected && !isHovered && (
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        )}

        {/* Indicador de seleção */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
