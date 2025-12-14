/**
 * Chapters data loader
 * Loads chapter information from chapters.json
 */

import fs from "fs";
import path from "path";
import { type Chapter, type ChapterFilters } from "~/types";

const REFERENCE_DIR = path.join(process.cwd(), "reference");
const CHAPTERS_FILE = path.join(REFERENCE_DIR, "chapters.json");

let chaptersCache: Chapter[] | null = null;

/**
 * Load all chapters from chapters.json
 */
export function loadChapters(): Chapter[] {
  if (chaptersCache) {
    return chaptersCache;
  }

  const fileContents = fs.readFileSync(CHAPTERS_FILE, "utf-8");
  chaptersCache = JSON.parse(fileContents) as Chapter[];
  return chaptersCache;
}

/**
 * Filter chapters based on criteria
 */
export function filterChapters(filters: ChapterFilters): Chapter[] {
  let chapters = loadChapters();

  if (filters.activeOnly) {
    chapters = chapters.filter((c) => c.Active === "Active");
  }

  if (filters.district) {
    chapters = chapters.filter((c) => c.District === filters.district);
  }

  if (filters.institutionType) {
    chapters = chapters.filter(
      (c) => c["Institution Type"] === filters.institutionType,
    );
  }

  if (filters.ncaaConference) {
    chapters = chapters.filter(
      (c) => c["NCAA Conference"] === filters.ncaaConference,
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    chapters = chapters.filter(
      (c) =>
        c.Chapter.toLowerCase().includes(searchLower) ||
        c.School.toLowerCase().includes(searchLower) ||
        c.Location.toLowerCase().includes(searchLower),
    );
  }

  return chapters;
}

/**
 * Get a single chapter by number
 */
export function getChapterByNumber(number: string): Chapter | undefined {
  const chapters = loadChapters();
  return chapters.find((c) => c.Number === number);
}

/**
 * Get unique districts
 */
export function getDistricts(): string[] {
  const chapters = loadChapters();
  const districts = new Set(chapters.map((c) => c.District));
  return Array.from(districts).sort();
}

/**
 * Get unique NCAA conferences
 */
export function getNcaaConferences(): string[] {
  const chapters = loadChapters();
  const conferences = new Set(chapters.map((c) => c["NCAA Conference"]));
  return Array.from(conferences).sort();
}
