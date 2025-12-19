import React from "react";

export default function PagesContainer({ slugs = [] }) {
  return (
    <ul className="list-disc pl-6">
      {slugs.map((s) => (
        <li key={s}>
          <a href={`/pages/${s}`} className="underline">
            {s}
          </a>
        </li>
      ))}
    </ul>
  );
}
