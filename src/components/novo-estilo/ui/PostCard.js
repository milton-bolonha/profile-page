import React from "react";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }) {
  const { slug, frontmatter } = post;
  return (
    <a
      href={`/posts/${slug}`}
      className="block group rounded-md overflow-hidden border bg-white dark:bg-neutral-900"
    >
      {frontmatter.featuredImage ? (
        <img
          src={frontmatter.featuredImage}
          alt={frontmatter.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      ) : null}
      <div className="p-4">
        <div className="text-xs opacity-70">
          {formatDate(frontmatter.publishDate)}
        </div>
        <div className="mt-1 font-medium group-hover:underline">
          {frontmatter.title}
        </div>
        {frontmatter.excerpt ? (
          <p className="mt-2 text-sm opacity-80 line-clamp-2">
            {frontmatter.excerpt}
          </p>
        ) : null}
      </div>
    </a>
  );
}
