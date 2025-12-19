import React from "react";
import { formatDate } from "@/lib/utils";

export default function PostTemplate({ frontmatter, html }) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      <header>
        <h1 className="text-3xl font-semibold">{frontmatter.title}</h1>
        <div className="mt-2 text-sm opacity-70">
          {frontmatter.author ? `${frontmatter.author} • ` : null}
          {formatDate(frontmatter.publishDate)}
          {frontmatter.readTime ? ` • ${frontmatter.readTime}` : null}
        </div>
        {frontmatter.featuredImage ? (
          <img
            src={frontmatter.featuredImage}
            alt={frontmatter.title}
            className="mt-6 w-full h-auto rounded"
          />
        ) : null}
      </header>
      <div
        className="prose dark:prose-invert mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <footer className="mt-12 border-t pt-6 text-sm opacity-80">
        {frontmatter.tags?.length ? (
          <div>Tags: {frontmatter.tags.join(", ")}</div>
        ) : null}
      </footer>
    </article>
  );
}
