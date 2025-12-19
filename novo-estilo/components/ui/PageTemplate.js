import React from "react";

export default function PageTemplate({ frontmatter, html }) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-10">
      <header>
        <h1 className="text-3xl font-semibold">{frontmatter.title}</h1>
      </header>
      <div
        className="prose dark:prose-invert mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
