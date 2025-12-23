// src/utils/helpers.js
export const setCursor = (containerRef, style) => {
  if (containerRef.current) containerRef.current.style.cursor = style;
};

export const showFloatingScore = (amount, type) => {
  const el = document.createElement("div");
  el.className = "float-score";
  el.innerText = "+" + amount;
  const x = window.innerWidth / 2 + (Math.random() * 100 - 50);
  const y = window.innerHeight / 2 - 50 - Math.random() * 50;

  el.style.position = "absolute";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.color = type === "hit" ? "#fff" : "#ffd700";
  el.style.fontSize = "1.2rem";
  el.style.fontFamily = "Montserrat, sans-serif";
  el.style.fontWeight = "bold";
  el.style.pointerEvents = "none";
  el.style.zIndex = "100";
  el.style.textShadow = "0 0 5px rgba(0,0,0,0.5)";

  el.animate(
    [
      { transform: "translateY(0)", opacity: 1 },
      { transform: "translateY(-50px)", opacity: 0 },
    ],
    {
      duration: 1000,
      easing: "ease-out",
    }
  );

  document.body.appendChild(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 1000);
};
