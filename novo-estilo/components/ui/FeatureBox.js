import React from "react";

export default function FeatureBox({
  title,
  paragraph,
  items = [],
  itemBg = "red", // "red" | "green" | url
}) {
  const itemBgUrl = (() => {
    if (itemBg === "red") return "/images/item-bg-red.png";
    if (itemBg === "green") return "/images/item-bg-green.png";
    return itemBg || "/images/item-bg-red.png";
  })();

  return (
    <div className="rounded-4xl p-6 md:p-8">
      <h3 className="Inter text-2xl md:text-3xl font-normal mb-3">{title}</h3>
      {paragraph ? (
        typeof paragraph === "string" ? (
          <p
            className="Inter text-base opacity-90 mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: String(paragraph) }}
          />
        ) : (
          <p className="Inter text-base opacity-90 mb-6 leading-relaxed">
            {paragraph}
          </p>
        )
      ) : null}

      <ul className="space-y-3">
        {items.map((text, idx) => (
          <li
            key={idx}
            className="flex items-center rounded-lg px-4 py-3 SpaceMono"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#F4F0FF",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <img
              src={itemBgUrl}
              alt="checkbox"
              className="w-6 h-6 mr-4 flex-shrink-0"
            />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
