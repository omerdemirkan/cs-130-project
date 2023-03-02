import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { GraphNode, GraphEdge } from "../../../client/store/graph"

export const prismaRouter = createTRPCRouter({
    saveGraph: publicProcedure
        .input(z.object({ nodes: z.array(z.any()), edges: z.array(z.any()) }))
        .mutation(({ ctx, input }) => {
            const nodes = (input.nodes as GraphNode[])
            const edges = (input.edges as GraphEdge[])

            return ctx.prisma.graph.create({
                data: {
                    graphContents: JSON.stringify({nodes, edges})
                },
            });
        }),

    readGraph: publicProcedure
        .mutation(({ ctx }) => {
            return ctx.prisma.graph.findFirst();
        }),
});