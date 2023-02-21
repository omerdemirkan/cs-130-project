import { createTRPCRouter } from "./trpc";
import { fusekiRouter } from "./routers/fuseki";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  fuseki: fusekiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
