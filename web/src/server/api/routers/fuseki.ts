import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { fusekiClient } from '../../../utils/fuseki'
import axios from "axios";

export const fusekiRouter = createTRPCRouter({
    /**
     * Returns {@code true} if the Fuseki server is online; otherwise, returns {@code false}.
     */
    // TODO: WE SHOULDN'T AUTOMATICALLY ASSUME THE SERVER EXISTS AT localhost:3030!
    getStatus: publicProcedure
        .query(async () => {
            return await fusekiClient.getServerStatus()
        }),



    /**
     * TODO: DESCRIPTION
     */
    // TODO: Change to protectedProcedure
    createDataset: publicProcedure
        .input(z.object({
            datasetName: z.string(),
            datasetType: z.string().default('mem')
        }))
        .mutation(async ({ input }) => {
            try {
                await fusekiClient.createDataset(input)
            } catch (e) {
                console.error('Error:' + e);
            }
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
            var url = fusekiClient.getFusekiUrl(`/${input.datasetName}/data?default`)
            var headers = {'Content-Type': 'text/turtle;charset=utf-8'} 
            await axios.post(url, input.dataset, { headers: headers })
        }),
});