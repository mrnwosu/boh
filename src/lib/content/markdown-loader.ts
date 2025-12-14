/**
 * Markdown content loader
 * Loads markdown files from reference/ directory
 */

import fs from "fs";
import path from "path";

const REFERENCE_DIR = path.join(process.cwd(), "reference");

export interface MarkdownContent {
  content: string;
  fileName: string;
}

/**
 * Load a markdown file by path relative to reference/
 */
export function loadMarkdown(relativePath: string): MarkdownContent {
  const filePath = path.join(REFERENCE_DIR, relativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${relativePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return {
    content,
    fileName: path.basename(filePath, ".md"),
  };
}

/**
 * Load all founding father markdown files
 */
export function loadFoundingFathers(): Map<string, MarkdownContent> {
  const foundersDir = path.join(REFERENCE_DIR, "founding_fathers");
  const files = fs.readdirSync(foundersDir);

  const founders = new Map<string, MarkdownContent>();

  for (const file of files) {
    if (file.endsWith(".md") && file !== "README.md" && file !== "all_founding_fathers_consolidated.md") {
      const slug = file.replace(".md", "");
      const content = loadMarkdown(`founding_fathers/${file}`);
      founders.set(slug, content);
    }
  }

  return founders;
}

/**
 * Load all awards markdown files
 */
export function loadAwards(): Map<string, MarkdownContent> {
  const awardsDir = path.join(REFERENCE_DIR, "awards_and_jewelry");
  const files = fs.readdirSync(awardsDir);

  const awards = new Map<string, MarkdownContent>();

  for (const file of files) {
    if (file.endsWith(".md") && file !== "README.md") {
      const slug = file.replace(".md", "");
      const content = loadMarkdown(`awards_and_jewelry/${file}`);
      awards.set(slug, content);
    }
  }

  return awards;
}

/**
 * Get list of all founding father slugs
 */
export function getFoundingFatherSlugs(): string[] {
  const founders = loadFoundingFathers();
  return Array.from(founders.keys()).sort();
}

/**
 * Get list of all award slugs
 */
export function getAwardSlugs(): string[] {
  const awards = loadAwards();
  return Array.from(awards.keys()).sort();
}
