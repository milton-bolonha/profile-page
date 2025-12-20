import React, { ReactNode } from 'react';

interface PageSectionProps {
  isBoxed?: boolean;
  bgImage?: string;
  bgColor?: string;
  numColumns?: 1 | 2 | 3 | 4;
  gap?: string;
  maxWidth?: string;
  hPadding?: string;
  vPadding?: string;
  title?: string;
  subtitle?: string;
  ctaBtnText?: string;
  ctaBtnLink?: string;
  ctaContrastBtnText?: string;
  ctaContrastBtnLink?: string;
  ctaContrastBtnPosition?: "left" | "right" | "center";
  children: ReactNode;
  className?: string;
}

export const PageSection = ({
  isBoxed = false,
  bgImage,
  bgColor = "bg-white dark:bg-gray-900",
  numColumns = 1,
  gap = "gap-6",
  maxWidth = "max-w-6xl",
  hPadding = "px-6 md:px-8",
  vPadding = "py-12 md:py-16",
  title,
  subtitle,
  ctaBtnText,
  ctaBtnLink,
  ctaContrastBtnText,
  ctaContrastBtnLink,
  ctaContrastBtnPosition = "center",
  children,
  className = "",
}: PageSectionProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const ctaPosition = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
  };

  return (
    <section
      className={`${bgColor} ${vPadding} ${className}`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      )}
      <div className={`relative ${isBoxed ? `${maxWidth} mx-auto` : ""} ${hPadding}`}>
        {(title || subtitle) && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            {title && (
              <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridCols[numColumns]} ${gap}`}>
          {children}
        </div>

        {(ctaBtnText || ctaContrastBtnText) && (
          <div className={`flex flex-wrap ${ctaPosition[ctaContrastBtnPosition]} gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12`}>
            {ctaBtnText && ctaBtnLink && (
              <a
                href={ctaBtnLink}
                className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {ctaBtnText}
              </a>
            )}
            {ctaContrastBtnText && ctaContrastBtnLink && (
              <a
                href={ctaContrastBtnLink}
                className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                {ctaContrastBtnText}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
