import fs from "fs";
import path from "path";
import { readMarkdownFile, markdownToHtml } from "./markdown";

const pagesDir = path.join(process.cwd(), "content", "pages");

export function getAllPageSlugs() {
  return fs
    .readdirSync(pagesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPageBySlug(slug) {
  const filePath = path.join(pagesDir, `${slug}.md`);
  return readMarkdownFile(filePath);
}

export async function getPageHtmlBySlug(slug) {
  const { frontmatter, content } = getPageBySlug(slug);
  const html = await markdownToHtml(content);
  return { frontmatter, html };
}
