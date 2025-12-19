import React, { useState } from "react";

export default function TopRibbon({
  messages = [],
  bgColor = "bg-black",
  textColor = "text-white",
  speed = 30,
  pauseOnHover = true,
  showCloseButton = true,
}) {
  const [visible, setVisible] = useState(true);
  if (!visible || messages.length === 0) return null;

  return (
    <div
      className={`${bgColor} ${textColor} w-full overflow-hidden`}
      role="region"
      aria-label="Avisos"
    >
      <div className="relative">
        <div
          className="whitespace-nowrap flex items-center gap-8 py-2 animate-[marquee_linear_infinite]"
          style={{ animationDuration: `${speed}s` }}
        >
          {messages.concat(messages).map((msg, i) => (
            <span key={i} className="text-sm">
              {msg}
            </span>
          ))}
        </div>
        {showCloseButton ? (
          <button
            onClick={() => setVisible(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs underline"
          >
            Fechar
          </button>
        ) : null}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
