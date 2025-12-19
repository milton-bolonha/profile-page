import fs from "fs";
import path from "path";
import { readMarkdownFile, markdownToHtml } from "./markdown";

const postsDir = path.join(process.cwd(), "content", "posts");

export function getAllPostSlugs() {
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts() {
  const slugs = getAllPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug));
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishDate) - new Date(a.frontmatter.publishDate)
  );
}

export function getPostBySlug(slug) {
  const filePath = path.join(postsDir, `${slug}.md`);
  const { frontmatter, content } = readMarkdownFile(filePath);
  return { slug, frontmatter, content };
}

export async function getPostHtmlBySlug(slug) {
  const { frontmatter, content } = getPostBySlug(slug);
  const html = await markdownToHtml(content);
  return { frontmatter, html };
}

export function getFeaturedPosts(limit = 3) {
  return getAllPosts()
    .filter((p) => p.frontmatter.featuredPost)
    .slice(0, limit);
}
