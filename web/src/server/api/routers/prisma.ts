import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { GraphNode, GraphEdge } from "../../../client/store/graph";

export const prismaRouter = createTRPCRouter({
  /**
   * Saves and pushes a graph to the Prisma backend as a JSON string.
   * @param nodes The nodes of the graph.
   * @param edges The edges of the graph.
   */
  saveGraph: publicProcedure
    .input(z.object({ nodes: z.array(z.any()), edges: z.array(z.any()) }))
    .mutation(({ ctx, input }) => {
      const nodes = input.nodes as GraphNode[];
      const edges = input.edges as GraphEdge[];

      return ctx.prisma.graph.create({
        data: {
          graphContents: JSON.stringify({ nodes, edges }),
        },
      });
    }),

  readGraph: publicProcedure
    .input(z.object({ graphId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.graph.findUnique({ where: { id: input.graphId } });
    }),
});
