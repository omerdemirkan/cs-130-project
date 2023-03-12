import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { FusekiService } from "../../../utils/fuseki";
import axios from "axios";
import { GraphNode } from "../../../client/store/graph";

const fusekiClient = new FusekiService("http://localhost:3030");

/**
 * Wrapper for FusekiService containing tRPC procedures related to Fuseki operations.
 */
export const fusekiRouter = createTRPCRouter({
  /**
   * @returns {@code true} if the Fuseki server is online; otherwise, returns {@code false}.
   */
  getStatus: publicProcedure.query(() => fusekiClient.getServerStatus()),

  /**
   * @returns The Fuseki server data.
   */
  getServerData: publicProcedure.query(() => fusekiClient.getServerData()),

  /**
   * @returns The current tasks on the Fuseki server.
   */
  getTasks: publicProcedure.query(() => fusekiClient.getTasks()),

  /**
   * @returns The main URL of the Fuseki server.
   */
  getUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(({ input }) => {
      return fusekiClient.getFusekiUrl(input.url);
    }),

  /**
   * @param datasetName The name of the target dataset.
   * @returns The URL for uploading data based on the dataset name.
   */
  getUploadUrl: publicProcedure
    .input(z.object({ datasetName: z.string() }))
    .query(({ input }) => {
      return fusekiClient.getFusekiUploadUrl(input.datasetName);
    }),

  /**
   * @param datasetName The name of the target dataset.
   * @returns The statistics of the dataset
   */
  getDatasetStats: publicProcedure
    .input(z.object({ datasetName: z.string() }))
    .query(({ input }) => {
      return fusekiClient.getDatasetStats(input.datasetName);
    }),

  /**
   * @param datasetName The name of the target dataset.
   * @returns The size of the dataset.
   */
  getDatasetSize: publicProcedure
    .input(
      z.object({
        datasetName: z.string(),
        endpoint: z.string(),
      })
    )
    .query(({ input }) => {
      return fusekiClient.getDatasetSize(input.datasetName, input.endpoint);
    }),

  /**
   * @param datasetName The name of the target dataset.
   * @param datasetType Either {@code 'mem'} or {@code 'tdb2'}.
   */
  createDataset: publicProcedure
    .input(
      z.object({
        datasetName: z.string(),
        datasetType: z
          .union([z.literal("mem"), z.literal("tdb2")])
          .default("mem"),
      })
    )
    .mutation(({ input }) => {
      return fusekiClient.createDataset(input);
    }),

  /**
   * @param datasetName The name of the target dataset.
   * @param query The SPARQL query to use on the dataset.
   * @returns The result of the query on the dataset.
   */
  queryDataset: publicProcedure
    .input(
      z.object({
        datasetName: z.string(),
        query: z.string(),
      })
    )
    .mutation(({ input }) => {
      return fusekiClient.queryDataset(input);
    }),

  /**
   * Backs up the specified dataset.
   * @param datasetName The name of the target dataset.
   */
  backupDataset: publicProcedure
    .input(z.object({ datasetName: z.string() }))
    .mutation(({ input }) => {
      return fusekiClient.backupDataset(input.datasetName);
    }),

  /**
   * Deletes the specified dataset.
   * @param datasetName The name of the target dataset.
   */
  deleteDataset: publicProcedure
    .input(z.object({ datasetName: z.string() }))
    .mutation(({ input }) => {
      return fusekiClient.deleteDataset(input.datasetName);
    }),

  /**
   * Counts the triples in the graph represented by the dataset.
   * @param datasetName The name of the target dataset.
   * @param endpoint The endpoint of the dataset.
   * @returns A promise for the the amonut of counted graph triples.
   */
  countGraphTriples: publicProcedure
    .input(
      z.object({
        datasetName: z.string(),
        endpoint: z.string(),
      })
    )
    .query(({ input }) => {
      return fusekiClient.countGraphsTriples(input.datasetName, input.endpoint);
    }),

  /**
   * Gets the next expansion of the graph represented by the dataset based on the
   * specified node.
   * @param datasetName The name of the target dataset.
   * @param expansionNode The node to expand.
   * @returns A promise containing the expansion results.
   */
  expansionQueryDataset: publicProcedure
    .input(z.object({ datasetName: z.string(), expansionNode: z.any() }))
    .mutation(({ input }) => {
      var datasetName = input.datasetName;
      var graphNode = input.expansionNode as GraphNode;
      return fusekiClient.expansionQueryDataset({
        datasetName,
        expansionNode: graphNode,
      });
    }),

  /**
   * @param datasetName The name of the target dataset.
   * @param graphName The name of the graph represented by the dataset.
   * @returns A promise containing the current graph of the dataset.
   */
  fetchGraph: publicProcedure
    .input(
      z.object({
        datasetName: z.string(),
        graphName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return fusekiClient.fetchGraph(input.datasetName, input.graphName);
    }),

  /*     saveGraph: publicProcedure
        .input(z.object({
            datasetName: z.string(),
            graphName: z.string(),
            code: z.string(),
        }))
        .mutation(async ({ input }) => {
            return fusekiClient.saveGraph(input.datasetName, input.graphName, input.code);
        }), */
});
