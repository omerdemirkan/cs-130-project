import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { fusekiClient } from '../../../utils/fuseki'

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  /**
   * Returns {@code true} if the Fuseki server is online; otherwise, returns {@code false}.
   */
  // TODO: WE SHOULDN'T AUTOMATICALLY ASSUME THE SERVER EXISTS AT localhost:3030!
  getFusekiServerStatus: publicProcedure.query(async () => {
    return await fusekiClient.getServerStatus()
  })
});
