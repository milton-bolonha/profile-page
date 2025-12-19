export function formatDate(dateIso) {
  try {
    const date = new Date(dateIso);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return dateIso;
  }
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function isDraft(frontmatter) {
  return Boolean(frontmatter?.draft);
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
