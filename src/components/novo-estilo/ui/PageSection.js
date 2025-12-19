import React from "react";

export default function PageSection({
  id = "",
  isBoxed = true,
  bgImage = "",
  bgColor = " ",
  backgroundSize = "cover",
  isFullHeight = false,
  fullHeightSubtract = "var(--header-height, 0px)",
  numColumns = 1,
  gap = "gap-6",
  maxWidth = "max-w-7xl",
  hPadding = "px-6",
  vPadding = "py-12",
  titleSize = "text-3xl",
  ctaBtnColor = "",
  tagline = "",
  title = "",
  subtitle = "",
  ctaBtnText = "",
  ctaBtnLink = "#",
  ctaContrastBtnText = "",
  ctaContrastBtnLink = "#",
  ctaContrastBtnPosition = "left",
  children,
}) {
  function getReadableTextColor(color) {
    try {
      let r, g, b;
      if (typeof color !== "string") return "#ffffff";
      const c = color.trim();
      if (c.startsWith("#")) {
        const hex = c.slice(1);
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        }
      } else if (c.startsWith("rgb")) {
        const nums = c
          .replace(/rgba?\(/, "")
          .replace(/\)/, "")
          .split(",")
          .map((v) => parseFloat(v.trim()))
          .filter((v, i) => i < 3);
        [r, g, b] = nums;
      }
      if (
        [r, g, b].every(
          (v) => typeof v === "number" && !Number.isNaN(v) && v >= 0 && v <= 255
        )
      ) {
        // Perceived luminance (WCAG)
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luminance > 0.5 ? "#000000" : "#ffffff";
      }
      // Fallback
      return "#ffffff";
    } catch (_) {
      return "#ffffff";
    }
  }

  const primaryBtnStyle = ctaBtnColor
    ? { backgroundColor: ctaBtnColor, color: getReadableTextColor(ctaBtnColor) }
    : undefined;
  const contrastBtnStyle = ctaBtnColor
    ? { color: ctaBtnColor, borderColor: ctaBtnColor }
    : undefined;
  const columnsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-4",
  }[Math.min(Math.max(numColumns, 1), 4)];

  const wrapperClasses = [
    bgColor,
    vPadding,
    bgImage ? "relative" : "",
    isFullHeight && !fullHeightSubtract ? "h-screen flex items-center" : "",
    isFullHeight && fullHeightSubtract ? "flex items-center" : "",
    "w-full",
  ].join(" ");

  const sectionStyle = (() => {
    const style = {};
    if (bgImage) {
      style.backgroundImage = `url(${bgImage})`;
      style.backgroundSize = backgroundSize;
      style.backgroundPosition = "top center";
    }
    if (isFullHeight && fullHeightSubtract) {
      style.minHeight = `calc(102vh - ${fullHeightSubtract})`;
    }
    return style;
  })();
  const containerClasses = [isBoxed ? maxWidth : "", hPadding, "mx-auto"].join(
    " "
  );

  return (
    <section
      id={id || undefined}
      className={wrapperClasses}
      style={Object.keys(sectionStyle).length ? sectionStyle : undefined}
      aria-label={title || undefined}
    >
      {/* {bgImage ? (
        <div
          className="absolute inset-0 bg-black/40 pointer-events-none"
          aria-hidden="true"
        />
      ) : null} */}

      {/* Gradiente de transição no bottom quando há imagem de fundo */}
      {bgImage && (
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #030014 100%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className={containerClasses}>
        {(tagline || title || subtitle) && (
          <header className="mb-6 text-center mt-26">
            {tagline ? (
              <div
                className="inline-flex items-center px-4 py-2 border mb-4 "
                style={{
                  background:
                    "linear-gradient(90deg, rgba(229, 156, 255, 0.24) 0%, rgba(186, 156, 255, 0.24) 50%, rgba(156, 178, 255, 0.24) 100%)",
                  borderColor: "#BA9CFF",
                  borderRadius: "20px",
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "#BA9CFF" }}
                >
                  {tagline}
                </span>
              </div>
            ) : null}
            {title ? (
              <h2
                className={`${titleSize} font-semibold tracking-tight mb-4 Geologica`}
                dangerouslySetInnerHTML={{ __html: String(title) }}
              />
            ) : null}
            {subtitle ? (
              <p
                className="m-auto mt-5 mb-14 text-base opacity-80 max-w-[750px]"
                dangerouslySetInnerHTML={{ __html: String(subtitle) }}
              />
            ) : null}
          </header>
        )}

        <div className={["relative grid", columnsClass, gap].join(" ")}>
          {children}
        </div>

        {(ctaBtnText || ctaContrastBtnText) && (
          <div
            className={
              "flex flex-wrap items-center gap-6 " +
              (ctaContrastBtnPosition === "center"
                ? "justify-center"
                : ctaContrastBtnPosition === "right"
                ? "justify-end"
                : "justify-start")
            }
          >
            {ctaContrastBtnText ? (
              <a
                href={ctaContrastBtnLink}
                className="inline-flex items-center rounded-md border border-current px-8 py-2 text-md font-semibold transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
                style={contrastBtnStyle}
                aria-label={ctaContrastBtnText}
              >
                {ctaContrastBtnText}
              </a>
            ) : null}

            {ctaBtnText ? (
              <a
                href={ctaBtnLink}
                className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-8 py-2 text-md font-semibold text-[var(--color-primary-foreground)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
                style={primaryBtnStyle}
                aria-label={ctaBtnText}
              >
                {ctaBtnText}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
