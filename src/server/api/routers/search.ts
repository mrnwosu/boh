/**
 * Search tRPC Router
 * Provides global search functionality across all content
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { loadAllTrivia, TOPICS } from "~/lib/content/trivia-loader";
import { filterChapters } from "~/lib/content/chapters-loader";
import { loadFoundingFathers, loadAwards } from "~/lib/content/markdown-loader";
import { loadPastPresidents } from "~/lib/content/presidents-loader";

// Search result types
export interface SearchResult {
  id: string;
  type: "topic" | "flashcard" | "chapter" | "founder" | "award" | "president" | "page";
  title: string;
  description?: string;
  href: string;
  category: string;
}

// Navigation pages for quick access
const NAVIGATION_PAGES: SearchResult[] = [
  {
    id: "nav-home",
    type: "page",
    title: "Home",
    description: "Return to the home page",
    href: "/",
    category: "Pages",
  },
  {
    id: "nav-flashcards",
    type: "page",
    title: "Flashcards",
    description: "Study with flashcards",
    href: "/flashcards",
    category: "Pages",
  },
  {
    id: "nav-quizzes",
    type: "page",
    title: "Quizzes",
    description: "Test your knowledge",
    href: "/quizzes",
    category: "Pages",
  },
  {
    id: "nav-info",
    type: "page",
    title: "Information",
    description: "Browse all information pages",
    href: "/info",
    category: "Pages",
  },
  {
    id: "nav-dashboard",
    type: "page",
    title: "Dashboard",
    description: "View your progress and stats",
    href: "/dashboard",
    category: "Pages",
  },
  {
    id: "nav-chapters",
    type: "page",
    title: "Chapter Directory",
    description: "Browse all 343 chapters",
    href: "/info/chapters",
    category: "Pages",
  },
  {
    id: "nav-founders",
    type: "page",
    title: "Founding Fathers",
    description: "Learn about the 10 founders",
    href: "/info/founding-fathers",
    category: "Pages",
  },
  {
    id: "nav-awards",
    type: "page",
    title: "Awards & Jewelry",
    description: "Discover KKPsi awards",
    href: "/info/awards",
    category: "Pages",
  },
  {
    id: "nav-makovsky",
    type: "page",
    title: "Bohumil Makovsky",
    description: "Learn about the Guiding Spirit",
    href: "/info/bohumil-makovsky",
    category: "Pages",
  },
  {
    id: "nav-history",
    type: "page",
    title: "History & Timeline",
    description: "Explore KKPsi's history",
    href: "/info/history",
    category: "Pages",
  },
  {
    id: "nav-presidents",
    type: "page",
    title: "Past Presidents",
    description: "National leadership history",
    href: "/info/presidents",
    category: "Pages",
  },
];

export const searchRouter = createTRPCRouter({
  // Global search across all content
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        limit: z.number().min(1).max(50).optional().default(20),
      }),
    )
    .query(({ input }) => {
      const { query, limit } = input;
      const searchTerm = query.toLowerCase().trim();
      const results: SearchResult[] = [];

      // 1. Search navigation pages (always include matching pages)
      for (const page of NAVIGATION_PAGES) {
        if (
          page.title.toLowerCase().includes(searchTerm) ||
          page.description?.toLowerCase().includes(searchTerm)
        ) {
          results.push(page);
        }
      }

      // 2. Search topics (flashcard categories)
      for (const topic of TOPICS) {
        if (
          topic.title.toLowerCase().includes(searchTerm) ||
          topic.description.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: `topic-${topic.slug}`,
            type: "topic",
            title: topic.title,
            description: `${topic.totalQuestions} flashcards - ${topic.description}`,
            href: `/flashcards/${topic.slug}`,
            category: "Flashcard Topics",
          });
        }
      }

      // 3. Search flashcard questions
      const allTrivia = loadAllTrivia();
      for (const [topicSlug, triviaFile] of allTrivia) {
        const topicInfo = TOPICS.find((t) => t.slug === topicSlug);
        for (const question of triviaFile.questions) {
          // Search in question versions and answer
          const matchesQuestion = question.questionVersions.some((q) =>
            q.toLowerCase().includes(searchTerm),
          );
          const matchesAnswer = question.correctAnswer
            .toLowerCase()
            .includes(searchTerm);
          const matchesTags = question.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm),
          );

          if (matchesQuestion || matchesAnswer || matchesTags) {
            results.push({
              id: `flashcard-${topicSlug}-${question.id}`,
              type: "flashcard",
              title: question.correctAnswer,
              description: question.questionVersions[0]?.slice(0, 100) + "...",
              href: `/flashcards/${topicSlug}`,
              category: topicInfo?.title ?? (topicSlug as string),
            });
          }

          // Limit flashcard results to avoid overwhelming
          if (results.filter((r) => r.type === "flashcard").length >= 10) break;
        }
      }

      // 4. Search chapters
      const chapters = filterChapters({ activeOnly: false });
      for (const chapter of chapters) {
        if (
          chapter.Chapter.toLowerCase().includes(searchTerm) ||
          chapter.School.toLowerCase().includes(searchTerm) ||
          chapter.Location.toLowerCase().includes(searchTerm) ||
          chapter.Number.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: `chapter-${chapter.Number}`,
            type: "chapter",
            title: `${chapter.Chapter} - ${chapter.School}`,
            description: `${chapter.Location} | District ${chapter.District}${!chapter.Active ? " (Inactive)" : ""}`,
            href: `/info/chapters?search=${encodeURIComponent(chapter.School)}`,
            category: "Chapters",
          });
        }

        // Limit chapter results
        if (results.filter((r) => r.type === "chapter").length >= 8) break;
      }

      // 5. Search founding fathers
      const founders = loadFoundingFathers();
      for (const [slug, founder] of founders) {
        const name = founder.fileName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        if (
          name.toLowerCase().includes(searchTerm) ||
          founder.content.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: `founder-${slug}`,
            type: "founder",
            title: name,
            description: "Founding Father of Kappa Kappa Psi",
            href: `/info/founding-fathers/${slug}`,
            category: "Founding Fathers",
          });
        }
      }

      // 6. Search awards
      const awards = loadAwards();
      for (const [slug, award] of awards) {
        const name = award.fileName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        if (
          name.toLowerCase().includes(searchTerm) ||
          award.content.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: `award-${slug}`,
            type: "award",
            title: name,
            description: "KKPsi Award",
            href: `/info/awards/${slug}`,
            category: "Awards & Jewelry",
          });
        }
      }

      // 7. Search past presidents
      const presidents = loadPastPresidents();
      for (const president of presidents) {
        if (
          president.Name.toLowerCase().includes(searchTerm) ||
          president.Chapter?.toLowerCase().includes(searchTerm) ||
          president.University?.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: `president-${president.Name.replace(/\s+/g, "-").toLowerCase()}`,
            type: "president",
            title: president.Name,
            description: `${president.Years}${president.Chapter ? ` | ${president.Chapter}` : ""}`,
            href: "/info/presidents",
            category: "Past Presidents",
          });
        }

        // Limit president results
        if (results.filter((r) => r.type === "president").length >= 5) break;
      }

      // Return limited results, prioritizing pages and topics
      const priorityOrder: SearchResult["type"][] = [
        "page",
        "topic",
        "founder",
        "award",
        "chapter",
        "flashcard",
        "president",
      ];

      const sortedResults = results.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.type);
        const bIndex = priorityOrder.indexOf(b.type);
        return aIndex - bIndex;
      });

      return sortedResults.slice(0, limit);
    }),

  // Get quick access items (no search required)
  getQuickAccess: publicProcedure.query(() => {
    return {
      pages: NAVIGATION_PAGES.slice(0, 6), // Top 6 pages
      topics: TOPICS.map((topic) => ({
        id: `topic-${topic.slug}`,
        type: "topic" as const,
        title: topic.title,
        description: `${topic.totalQuestions} flashcards`,
        href: `/flashcards/${topic.slug}`,
        category: "Study Topics",
      })),
    };
  }),
});
