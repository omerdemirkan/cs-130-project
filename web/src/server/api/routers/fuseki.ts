import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { fusekiClient, FusekiExpansionQueryResults } from '../../../utils/fuseki'
import axios from "axios";
import { message, Upload } from "antd";
import { GraphNode } from "../../../client/store/graph";

export const fusekiRouter = createTRPCRouter({
    /**
     * Returns {@code true} if the Fuseki server is online; otherwise, returns {@code false}.
     */
    // TODO: WE SHOULDN'T AUTOMATICALLY ASSUME THE SERVER EXISTS AT localhost:3030!
    getStatus: publicProcedure
        .query(() => {
            return fusekiClient.getServerStatus()
        }),



    getUploadUrl: publicProcedure
        .input(z.object({ datasetName: z.string() }))
        .query(({ input }) => {
            return fusekiClient.getFusekiUploadUrl(input.datasetName);
        }),



    /**
     * TODO: DESCRIPTION
     */
    // TODO: Change to protectedProcedure
    createDataset: publicProcedure
        .input(z.object({
            datasetName: z.string(),
            datasetType: z.union([z.literal('mem'), z.literal('tdb2')]).default('mem'),
        }))
        .mutation(({ input }) => {
            return fusekiClient.createDataset(input);
        }),
    

        
    deleteDataset: publicProcedure
        .input(z.object({ datasetName: z.string() }))
        .mutation(({ input }) => {
            return fusekiClient.deleteDataset(input.datasetName);
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



    queryDataset: publicProcedure
        .input(z.object({ 
            datasetName: z.string(), 
            query: z.string() }))
        .mutation(({ input }) => {
            return fusekiClient.queryDataset(input);
        }),


    
    getServerData: publicProcedure
        .query(() => fusekiClient.getServerData()),



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
});