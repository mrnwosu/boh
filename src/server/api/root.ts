import { postRouter } from "~/server/api/routers/post";
import { contentRouter } from "~/server/api/routers/content";
import { quizRouter } from "~/server/api/routers/quiz";
import { flashcardRouter } from "~/server/api/routers/flashcard";
import { searchRouter } from "~/server/api/routers/search";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { settingsRouter } from "~/server/api/routers/settings";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  content: contentRouter,
  quiz: quizRouter,
  flashcard: flashcardRouter,
  search: searchRouter,
  dashboard: dashboardRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
