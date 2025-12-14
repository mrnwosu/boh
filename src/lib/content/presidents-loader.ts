/**
 * Past presidents data loader
 */

import fs from "fs";
import path from "path";
import { type PastPresident } from "~/types";

const REFERENCE_DIR = path.join(process.cwd(), "reference");
const PRESIDENTS_FILE = path.join(REFERENCE_DIR, "past-presidents.json");

let presidentsCache: PastPresident[] | null = null;

/**
 * Load all past presidents
 */
export function loadPastPresidents(): PastPresident[] {
  if (presidentsCache) {
    return presidentsCache;
  }

  const fileContents = fs.readFileSync(PRESIDENTS_FILE, "utf-8");
  presidentsCache = JSON.parse(fileContents) as PastPresident[];
  return presidentsCache;
}
