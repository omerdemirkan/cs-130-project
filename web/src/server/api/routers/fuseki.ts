import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { FusekiService } from '../../../utils/fuseki'
import axios from "axios";
import { GraphNode } from "../../../client/store/graph";

const fusekiClient = new FusekiService("http://localhost:3030");

export const fusekiRouter = createTRPCRouter({
    /**
     * Returns {@code true} if the Fuseki server is online; otherwise, returns {@code false}.
     */
    getStatus: publicProcedure.query(() => fusekiClient.getServerStatus()),



    getServerData: publicProcedure.query(() => fusekiClient.getServerData()),



    getTasks: publicProcedure.query(() => fusekiClient.getTasks()),



    getUrl: publicProcedure
        .input(z.object({ url: z.string() }))
        .query(({ input }) => {
            return fusekiClient.getFusekiUrl(input.url);
        }),



    getUploadUrl: publicProcedure
        .input(z.object({ datasetName: z.string() }))
        .query(({ input }) => {
            return fusekiClient.getFusekiUploadUrl(input.datasetName);
        }),



    getDatasetStats: publicProcedure
        .input(z.object({ datasetName: z.string() }))
        .query(({ input }) => {
            return fusekiClient.getDatasetStats(input.datasetName);
        }),



    getDatasetSize: publicProcedure
        .input(z.object({ 
            datasetName: z.string(), 
            endpoint: z.string() }))
        .query(({ input }) => {
            return fusekiClient.getDatasetSize(input.datasetName, input.endpoint);
        }),



    /**
     * TODO: DESCRIPTION
     */
    createDataset: publicProcedure
        .input(z.object({
            datasetName: z.string(),
            datasetType: z.union([z.literal('mem'), z.literal('tdb2')]).default('mem'),
        }))
        .mutation(({ input }) => {
            return fusekiClient.createDataset(input);
        }),



    queryDataset: publicProcedure
        .input(z.object({ 
            datasetName: z.string(), 
            query: z.string() }))
        .mutation(({ input }) => {
            return fusekiClient.queryDataset(input);
        }),



    backupDataset: publicProcedure
        .input(z.object({ datasetName: z.string() }))
        .mutation(({ input }) => {
            return fusekiClient.backupDataset(input.datasetName);
        }),



    deleteDataset: publicProcedure
        .input(z.object({ datasetName: z.string() }))
        .mutation(({ input }) => {
            return fusekiClient.deleteDataset(input.datasetName);
        }),


    countGraphTriples: publicProcedure
        .input(z.object({ 
            datasetName: z.string(), 
            endpoint: z.string() }))
        .query(({ input }) => {
            return fusekiClient.countGraphsTriples(input.datasetName, input.endpoint);
        }),



    expansionQueryDataset: publicProcedure
        .input(z.object({ datasetName: z.string(), expansionNode: z.any()}))
        .mutation(({ input }) => {
            var datasetName = input.datasetName;
            var graphNode = (input.expansionNode as GraphNode);
            return fusekiClient.expansionQueryDataset({datasetName, expansionNode: graphNode});
        }),



    // TODO: Change to protectedProcedure
    uploadData: publicProcedure
        .input(z.object({
            datasetName: z.string(),
            dataset: z.string()
        }))
        .mutation(async ({ input }) => {
            // This is awful; I'm pretty sure I'm using tRPC for the wrong purposes
            // but I wanted to POST to the Fuseki server URL with the same interface.
            var url = fusekiClient.getFusekiUploadUrl(input.datasetName)
            var headers = {'Content-Type': 'text/turtle;charset=utf-8'} 
            await axios.post(url, input.dataset, { headers: headers })
        }),



    fetchGraph: publicProcedure
        .input(z.object({
            datasetName: z.string(),
            graphName: z.string()
        }))
        .mutation(async ({ input }) => {
            return fusekiClient.fetchGraph(input.datasetName, input.graphName);
        }),



    saveGraph: publicProcedure
        .input(z.object({
            datasetName: z.string(),
            graphName: z.string(),
            code: z.string(),
        }))
        .mutation(async ({ input }) => {
            return fusekiClient.saveGraph(input.datasetName, input.graphName, input.code);
        }),
});