import { createTRPCRouter } from "./trpc";
import { fusekiRouter } from "./routers/fuseki";
import { prismaRouter } from "./routers/prisma";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    fuseki: fusekiRouter,
    prisma: prismaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
