/**
 * Timeline Parser
 * Parses markdown content into structured timeline data
 */

import type { TimelineEvent, TimelineEra } from "~/components/shared";

type EventCategory = TimelineEvent["category"];

/**
 * Detect the category of an event based on keywords in its content
 */
function detectCategory(title: string, description: string): EventCategory {
  const text = `${title} ${description}`.toLowerCase();

  // KKΨ related
  if (text.includes("kappa") || text.includes("kkpsi") || text.includes("fraternity") ||
      text.includes("charter") || text.includes("convention") || text.includes("grand president")) {
    return "kkpsi";
  }

  // Honors and awards
  if (text.includes("award") || text.includes("honor") || text.includes("hall of fame") ||
      text.includes("doctorate") || text.includes("recognition") || text.includes("who's who") ||
      text.includes("honorary")) {
    return "honor";
  }

  // Education
  if (text.includes("college") || text.includes("university") || text.includes("director") ||
      text.includes("department") || text.includes("professor") || text.includes("student") ||
      text.includes("class of") || text.includes("education") || text.includes("major")) {
    return "education";
  }

  // Career
  if (text.includes("career") || text.includes("job") || text.includes("work") ||
      text.includes("band director") || text.includes("conductor") || text.includes("position") ||
      text.includes("appointed") || text.includes("hired") || text.includes("formed")) {
    return "career";
  }

  // Personal
  if (text.includes("born") || text.includes("birth") || text.includes("death") ||
      text.includes("marriage") || text.includes("wife") || text.includes("family") ||
      text.includes("immigrat") || text.includes("mother") || text.includes("father") ||
      text.includes("passes away") || text.includes("dies")) {
    return "personal";
  }

  // Milestone (founding, first, elected)
  if (text.includes("first") || text.includes("elected") || text.includes("founded") ||
      text.includes("establish") || text.includes("citizen")) {
    return "milestone";
  }

  return undefined;
}

// Regex patterns
const eraHeaderRegex = /^## (.+?)(?:\s*\((.+?)\))?$/;
// Matches: **Title** - Description OR **Title** Description OR just **Title**
// Uses character class with regular dash, en-dash, and em-dash
const boldTitleRegex = /^\*\*(.+?)\*\*(?:\s*[\-\u2013\u2014]?\s*(.+))?$/;
const quickFactRegex = /^- \*\*(.+?):\*\*\s*(.+)$/;
const funFactHeaderRegex = /^### \d+\.\s*\*\*(.+?)\*\*$/;

/**
 * Parse a markdown timeline into structured era and event data
 */
export function parseTimelineMarkdown(markdown: string): TimelineEra[] {
  const eras: TimelineEra[] = [];
  const lines = markdown.split("\n");

  let currentEra: TimelineEra | null = null;
  let currentEventTitle = "";
  let currentEventDate = "";
  let currentEventDescription = "";
  let eventId = 0;

  const finalizeEvent = () => {
    if (currentEra && currentEventTitle && currentEventDate) {
      const description = currentEventDescription.trim();
      currentEra.events.push({
        id: `event-${eventId++}`,
        date: currentEventDate,
        title: currentEventTitle,
        description: description || currentEventTitle,
        category: detectCategory(currentEventTitle, description),
      });
      currentEventTitle = "";
      currentEventDate = "";
      currentEventDescription = "";
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? "";

    // Skip empty lines
    if (!line) continue;

    // Main title (# header) - skip
    if (line.startsWith("# ") && !line.startsWith("## ") && !line.startsWith("### ")) {
      continue;
    }

    // Era header (## header with date range in parentheses)
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      // Finalize any pending event
      finalizeEvent();

      // Extract era title and date range
      const eraMatch = eraHeaderRegex.exec(line);
      if (eraMatch) {
        const [, title, dateRange] = eraMatch;
        // Skip non-timeline sections (exact matches or specific patterns)
        const lowerTitle = title?.toLowerCase().trim() ?? "";
        if (lowerTitle === "quick facts" ||
            lowerTitle === "fun facts" ||
            lowerTitle === "legacy" ||
            lowerTitle.includes("key titles") ||
            lowerTitle.includes("achievements summary") ||
            lowerTitle === "summary") {
          currentEra = null;
          continue;
        }

        currentEra = {
          title: title?.trim() ?? "",
          dateRange: dateRange?.trim() ?? "",
          events: [],
        };
        eras.push(currentEra);
      }
      continue;
    }

    // Event header (### header) - format: "### Date" or "### Date - Title"
    if (line.startsWith("### ")) {
      // Finalize any pending event
      finalizeEvent();

      if (!currentEra) continue;

      // Parse the date/title
      const headerContent = line.replace("### ", "").trim();
      currentEventDate = headerContent;

      // Look ahead for **bold title** on the next non-empty line
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j]?.trim() ?? "";
        if (!nextLine) continue;

        // Check for bold title pattern: **Title** - Description
        const boldMatch = boldTitleRegex.exec(nextLine);
        if (boldMatch) {
          const [, title, desc] = boldMatch;
          currentEventTitle = title?.trim() ?? "";
          if (desc) {
            currentEventDescription = desc.trim();
          }
          i = j; // Skip to this line
        }
        break;
      }
      continue;
    }

    // If we have a current event being built, append to description
    if (currentEra && currentEventDate) {
      // Skip markdown artifacts
      if (line === "---" || line.startsWith("|") || line.startsWith("- **")) {
        continue;
      }

      // Handle bullet points
      if (line.startsWith("- ")) {
        currentEventDescription += (currentEventDescription ? "\n" : "") + line;
      } else if (!line.startsWith("#") && !line.startsWith("**") && line.length > 0) {
        // Regular text continuation
        currentEventDescription += (currentEventDescription ? " " : "") + line;
      }
    }
  }

  // Finalize last event
  finalizeEvent();

  // Filter out empty eras
  return eras.filter(era => era.events.length > 0);
}

/**
 * Parse founding father markdown which has a simpler timeline format
 * Format expected:
 * ## Timeline
 * ### Date
 * **Title** - Description OR **Title** Description
 * Additional description lines...
 */
export function parseFounderTimeline(markdown: string): TimelineEra[] {
  const eras: TimelineEra[] = [];
  const lines = markdown.split("\n");

  let inTimeline = false;
  let currentEra: TimelineEra | null = null;
  let currentEventDate = "";
  let currentEventTitle = "";
  let currentEventDescription = "";
  let eventId = 0;

  const finalizeEvent = () => {
    if (currentEra && currentEventTitle && currentEventDate) {
      const description = currentEventDescription.trim();
      currentEra.events.push({
        id: `event-${eventId++}`,
        date: currentEventDate,
        title: currentEventTitle,
        description: description || currentEventTitle,
        category: detectCategory(currentEventTitle, description),
      });
      currentEventTitle = "";
      currentEventDate = "";
      currentEventDescription = "";
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for Timeline section
    if (trimmed === "## Timeline") {
      inTimeline = true;
      // Create a single "Life & Legacy" era for founders
      currentEra = {
        title: "Life & Legacy",
        dateRange: "",
        events: [],
      };
      eras.push(currentEra);
      continue;
    }

    // Exit timeline on next ## section
    if (inTimeline && trimmed.startsWith("## ") && trimmed !== "## Timeline") {
      finalizeEvent();
      inTimeline = false;
      continue;
    }

    if (!inTimeline || !currentEra) continue;

    // Skip horizontal rules
    if (trimmed === "---") continue;

    // Event date (### header)
    if (trimmed.startsWith("### ")) {
      finalizeEvent();
      currentEventDate = trimmed.replace("### ", "").trim();
      continue;
    }

    // Event title and description (bold text starting with **)
    if (trimmed.startsWith("**") && currentEventDate) {
      // If we already have a title, finalize that event first
      if (currentEventTitle) {
        finalizeEvent();
      }

      const boldMatch = boldTitleRegex.exec(trimmed);
      if (boldMatch) {
        const [, title, desc] = boldMatch;
        currentEventTitle = title?.trim() ?? "";
        if (desc) {
          currentEventDescription = desc.trim();
        }
      }
      continue;
    }

    // Continuation of description (only if we have both date and title)
    if (currentEventDate && currentEventTitle && trimmed.length > 0) {
      if (trimmed.startsWith("- ")) {
        currentEventDescription += (currentEventDescription ? "\n" : "") + trimmed;
      } else if (!trimmed.startsWith("#")) {
        currentEventDescription += (currentEventDescription ? " " : "") + trimmed;
      }
    }
  }

  finalizeEvent();

  return eras.filter(era => era.events.length > 0);
}

/**
 * Extract quick facts from founding father markdown
 */
export interface QuickFact {
  label: string;
  value: string;
}

export function parseQuickFacts(markdown: string): QuickFact[] {
  const facts: QuickFact[] = [];
  const lines = markdown.split("\n");

  let inQuickFacts = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "## Quick Facts") {
      inQuickFacts = true;
      continue;
    }

    if (inQuickFacts && trimmed.startsWith("## ")) {
      break;
    }

    if (inQuickFacts && trimmed.startsWith("- **")) {
      const match = quickFactRegex.exec(trimmed);
      if (match) {
        const [, label, value] = match;
        if (label && value) {
          facts.push({ label: label.trim(), value: value.trim() });
        }
      }
    }
  }

  return facts;
}

/**
 * Extract fun facts from founding father markdown
 */
export interface FunFact {
  number: number;
  title: string;
  content: string;
}

export function parseFunFacts(markdown: string): FunFact[] {
  const funFacts: FunFact[] = [];
  const lines = markdown.split("\n");

  let inFunFacts = false;
  let currentFact: FunFact | null = null;
  let factNumber = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "## Fun Facts") {
      inFunFacts = true;
      continue;
    }

    if (inFunFacts && trimmed.startsWith("## ") && trimmed !== "## Fun Facts") {
      if (currentFact) {
        funFacts.push(currentFact);
      }
      break;
    }

    if (!inFunFacts) continue;

    // Fun fact header: ### 1. **Title**
    const factMatch = funFactHeaderRegex.exec(trimmed);
    if (factMatch) {
      if (currentFact) {
        funFacts.push(currentFact);
      }
      factNumber++;
      currentFact = {
        number: factNumber,
        title: factMatch[1]?.trim() ?? "",
        content: "",
      };
      continue;
    }

    // Content for current fact
    if (currentFact && trimmed.length > 0 && !trimmed.startsWith("#") && trimmed !== "---") {
      currentFact.content += (currentFact.content ? " " : "") + trimmed;
    }
  }

  if (currentFact) {
    funFacts.push(currentFact);
  }

  return funFacts;
}

/**
 * Extract legacy content from markdown
 */
export function parseLegacy(markdown: string): string {
  const lines = markdown.split("\n");
  let inLegacy = false;
  let legacy = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "## Legacy") {
      inLegacy = true;
      continue;
    }

    if (inLegacy && trimmed.startsWith("## ")) {
      break;
    }

    if (inLegacy && trimmed.length > 0 && trimmed !== "---") {
      legacy += (legacy ? "\n\n" : "") + trimmed;
    }
  }

  return legacy;
}
