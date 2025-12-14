/**
 * Content tRPC Router
 * Provides access to static content (chapters, founding fathers, awards, etc.)
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  loadChapters,
  filterChapters,
  getChapterByNumber,
  getDistricts,
  getNcaaConferences,
} from "~/lib/content/chapters-loader";
import {
  loadFoundingFathers,
  loadAwards,
  loadMarkdown,
} from "~/lib/content/markdown-loader";
import { loadPastPresidents } from "~/lib/content/presidents-loader";
import { TOPICS } from "~/lib/content/trivia-loader";

export const contentRouter = createTRPCRouter({
  // Get all chapters with optional filtering
  getChapters: publicProcedure
    .input(
      z
        .object({
          district: z.string().optional(),
          institutionType: z.enum(["PWI", "HBCU"]).optional(),
          ncaaConference: z.string().optional(),
          activeOnly: z.boolean().optional().default(true),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      if (!input) {
        return filterChapters({ activeOnly: true });
      }
      return filterChapters(input);
    }),

  // Get a single chapter by number
  getChapter: publicProcedure
    .input(z.object({ number: z.string() }))
    .query(({ input }) => {
      const chapter = getChapterByNumber(input.number);
      if (!chapter) {
        throw new Error(`Chapter ${input.number} not found`);
      }
      return chapter;
    }),

  // Get all districts
  getDistricts: publicProcedure.query(() => {
    return getDistricts();
  }),

  // Get all NCAA conferences
  getNcaaConferences: publicProcedure.query(() => {
    return getNcaaConferences();
  }),

  // Get all founding fathers (list with slugs)
  getFoundingFathers: publicProcedure.query(() => {
    const founders = loadFoundingFathers();
    return Array.from(founders.entries()).map(([slug, content]) => ({
      slug,
      name: content.fileName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }));
  }),

  // Get a single founding father by slug
  getFounder: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      const founders = loadFoundingFathers();
      const founder = founders.get(input.slug);

      if (!founder) {
        throw new Error(`Founder ${input.slug} not found`);
      }

      return {
        slug: input.slug,
        name: founder.fileName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        content: founder.content,
      };
    }),

  // Get all awards (list with slugs)
  getAwards: publicProcedure.query(() => {
    const awards = loadAwards();
    return Array.from(awards.entries()).map(([slug, content]) => ({
      slug,
      name: content.fileName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }));
  }),

  // Get a single award by slug
  getAward: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      const awards = loadAwards();
      const award = awards.get(input.slug);

      if (!award) {
        throw new Error(`Award ${input.slug} not found`);
      }

      return {
        slug: input.slug,
        name: award.fileName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        content: award.content,
      };
    }),

  // Get past presidents
  getPresidents: publicProcedure.query(() => {
    return loadPastPresidents();
  }),

  // Get Bohumil Makovsky content
  getMakovsky: publicProcedure.query(() => {
    const content = loadMarkdown("bohumil_makovsky_timeline.md");
    return {
      title: "Bohumil Makovsky",
      content: content.content,
    };
  }),

  // Get timeline by category
  getTimeline: publicProcedure
    .input(z.enum(["founding_fathers", "awards_and_jewelry", "bohumil_makovsky"]))
    .query(({ input }) => {
      const fileName = `${input}_timeline.md`;
      const content = loadMarkdown(fileName);
      return {
        category: input,
        content: content.content,
      };
    }),

  // Get all available topics
  getTopics: publicProcedure.query(() => {
    return TOPICS;
  }),
});
