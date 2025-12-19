import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export function readMarkdownFile(absolutePath) {
  const fileContents = fs.readFileSync(absolutePath, "utf8");
  const { data, content } = matter(fileContents);
  return { frontmatter: data, content };
}

export async function markdownToHtml(markdown) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}
