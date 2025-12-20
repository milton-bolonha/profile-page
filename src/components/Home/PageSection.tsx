import React from "react";
import { OptimizedImage } from "@/components/commons/OptimizedImage";
import { TextMotion } from "@/components/ui/TextMotion";

interface PageSectionProps {
  id?: string;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  bgImage?: string;
  vPadding?: string;
  titleSize?: string;
  className?: string;
  backgroundSize?: "cover" | "contain";
}

export const PageSection = ({
  id,
  title,
  subtitle,
  children,
  bgImage,
  vPadding = "py-20",
  titleSize = "text-4xl md:text-5xl",
  className = "",
  backgroundSize = "cover",
}: PageSectionProps) => {
  return (
    <section
      id={id}
      className={`relative w-full ${vPadding} ${className} overflow-hidden bg-transparent`}
    >
      {bgImage && (
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
          {/* Assuming bgImage is a path to an image in public folder */}
          <div
            className="w-full h-full bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(/${bgImage})`,
              backgroundSize: backgroundSize,
            }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2
            className={`${titleSize} font-bold text-foreground mb-6 ClashDisplay`}
          >
            <TextMotion trigger={true} stagger={0.05}>
              {title}
            </TextMotion>
          </h2>
          {subtitle && (
            <div className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {typeof subtitle === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: subtitle }} />
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>

        {children}
      </div>
    </section>
  );
};
