/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the 'License'); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import axios, { isAxiosError } from 'axios';
import qs from 'qs';
import { GraphNode } from '../client/store/graph';

const DATASET_SIZE_QUERY_1 = 'select (count(*) as ?count) {?s ?p ?o}';
const DATASET_SIZE_QUERY_2 =
    'select ?g (count(*) as ?count) {graph ?g {?s ?p ?o}} group by ?g';

export class FusekiService {
    isOffline: boolean;
    pathname: string;
    constructor(pathname: string) {
        this.isOffline = true;
        this.pathname = pathname;
    }



    /**
     * @returns The main URL of the Fuseki server.
     */
    getFusekiUrl = (url: string) => {
        // remove leading `/`'s
        let normalizedUrl = url;
        while (normalizedUrl.startsWith('/') && normalizedUrl.length > 0) {
            normalizedUrl = normalizedUrl.slice(1);
        }
        const pathname = this.pathname.endsWith('/') ?
            this.pathname :
            `${this.pathname}/`;
        return `${pathname}${normalizedUrl}`;
    };



    /**
     * @param datasetName The name of the target dataset.
     * @returns The URL for uploading data based on the dataset name.
     */
    getFusekiUploadUrl = (datasetName: string) => {
        return this.getFusekiUrl(`${datasetName}/data`);
    };



    /**
     * @returns The Fuseki server data.
     */
    getServerData = async (): Promise < GetServerDataResponse > => {
        const response = await axios.get(this.getFusekiUrl('/$/server'));
        return response.data as GetServerDataResponse;
    };



    /**
     * @returns {@code true} if the Fuseki server is online; otherwise, returns {@code false}.
     */
    getServerStatus = async () => {
        try {
            await axios.get(this.getFusekiUrl('/$/ping'));

            this.isOffline = false;
            return true;
        }
        catch (error) {
            this.isOffline = true;
            return false;
        }
    };



    /**
     * @param datasetName The name of the target dataset.
     * @returns The statistics of the dataset
     */
    getDatasetStats = async (datasetName: string) => {
        const response = await axios.get(
            this.getFusekiUrl(`/$/stats/${datasetName}`)
        );
        return response.data;
    };



    /**
     * @param datasetName The name of the target dataset.
     * @param query The SPARQL query to use on the dataset.
     * @returns The result of the query on the dataset.
     */
    queryDataset = async ({
        datasetName,
        query,
    }: {
        datasetName: string;
        query: string;
    }) => {
        if (datasetName.includes('/'))
            datasetName = datasetName.replace('/', '');

        const { data } = await axios.get(
            this.getFusekiUrl(`/${datasetName}/query`), {
                params: { query }
            }
        );
        return data as FusekiQueryResult;
    };



    /**
     * Gets the next expansion of the graph represented by the dataset based on the 
     * specified node.
     * @param datasetName The name of the target dataset.
     * @param expansionNode The node to expand.
     * @returns A promise containing the expansion results. 
     */
    expansionQueryDataset = async ({
        datasetName,
        expansionNode,
    }: {
        datasetName: string;
        expansionNode: GraphNode;
    }) => {
        console.log(expansionNode);
        console.log(this.getAsObjectExpansionQuery(expansionNode));
        console.log(this.getAsSubjectExpansionQuery(expansionNode));
        const [asObjectResult, asSubjectResult] = await Promise.all([
            this.queryDataset({
                datasetName,
                query: this.getAsObjectExpansionQuery(expansionNode),
            }),
            this.queryDataset({
                datasetName,
                query: this.getAsSubjectExpansionQuery(expansionNode),
            }),
        ]);

        const expansionNodeBinding: FusekiQueryBinding = {
            value: expansionNode.id,
            type: expansionNode.fusekiObjectType,
        };
        asObjectResult.results.bindings.forEach((binding) => {
            binding.object = expansionNodeBinding;
        });

        asSubjectResult.results.bindings.forEach((binding) => {
            binding.subject = expansionNodeBinding;
        });

        const expansionQueryResult: FusekiExpansionQueryResults = {
            head: { vars: ['subject', 'predicate', 'object'] },
            results: {
                // @ts-ignore
                bindings: [
                    ...asSubjectResult.results.bindings,
                    ...asObjectResult.results.bindings,
                ],
            },
        };
        return expansionQueryResult;
    };



    private getAsSubjectExpansionQuery = (expansionNode: GraphNode) => {
        const nodeStrRepresentation =
            this.getNodeQueryStrRepresentation(expansionNode);

        return `SELECT ?predicate ?object
                WHERE {
                    ${nodeStrRepresentation} ?predicate ?object
                }`;
    };



    private getNodeQueryStrRepresentation = (expansionNode: GraphNode) => {
        if (expansionNode.fusekiObjectType === 'uri')
            return `<${expansionNode.id}>`;

        const isNumericStr = !isNaN((+expansionNode.id));
        if (isNumericStr)
            return expansionNode.id;

        return `'${expansionNode.id}'`;
    };



    private getAsObjectExpansionQuery = (expansionNode: GraphNode) => {
        const nodeStrRepresentation =
            this.getNodeQueryStrRepresentation(expansionNode);

        return `SELECT ?subject ?predicate
                WHERE {
                    ?subject ?predicate ${nodeStrRepresentation}
                }`;
    };



    /**
     * @param datasetName The name of the target dataset.
     * @returns The size of the dataset.
     */
    getDatasetSize = async (datasetName: string, endpoint: string) => {
        const promisesResult = await Promise.all([
            axios.get(this.getFusekiUrl(`/${datasetName}/${endpoint}`), {
                params: {
                    query: DATASET_SIZE_QUERY_1,
                },
            }),
            axios.get(this.getFusekiUrl(`/${datasetName}/${endpoint}`), {
                params: {
                    query: DATASET_SIZE_QUERY_2,
                },
            }),
        ]);

        const results: any = {};
        const defaultGraphResult = promisesResult[0];
        results['default graph'] = defaultGraphResult.data.results.bindings[0].count.value;
        
        const allGraphResult = promisesResult[1];
        allGraphResult.data.results.bindings.forEach((binding: any) => {
            results[binding.g.value] = binding.count.value;
        });
        return results;
    };



    /**
     * Deletes the specified dataset.
     * @param datasetName The name of the target dataset.
     */
    deleteDataset = async (datasetName: string) => {
        await axios.delete(this.getFusekiUrl(`/$/datasets${datasetName}`));
    };



    /**
     * Backs up the specified dataset.
     * @param datasetName The name of the target dataset.
     */
    backupDataset = async (datasetName: string) => {
        return await axios.post(this.getFusekiUrl(`/$/backup${datasetName}`));
    };



    /**
     * @param datasetName The name of the target dataset.
     * @param datasetType Either {@code 'mem'} or {@code 'tdb2'}.
     */
    createDataset = async ({
        datasetName,
        datasetType,
    }: {
        datasetName: string;
        datasetType: 'tdb2' | 'mem';
    }) => {
        const data = qs.stringify({
            dbName: datasetName,
            dbType: datasetType,
        });
        // const data = new FormData()
        // data.set('dbName', datasetName)
        // data.set('dbType', datasetType)
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        try {
            await axios.post(this.getFusekiUrl('/$/datasets'), data, {
                headers,
            });
        }
        catch (error: unknown) {
            if (isAxiosError(error) && error.response) {
                if (error.response.status !== 200) {
                    if (error.response.status === 409) {
                        throw new Error(
                            `failed to create dataset '${datasetName}', reason: there is another dataset with the same name`
                        );
                    }
                    throw new Error(
                        `failed to create dataset '${datasetName}' with type ${datasetType}, reason: HTTP status: '${error.response.status}', message: ${error.response.statusText}`
                    );
                }
            }
            throw error;
        }
    };



    /**
     * @returns The current tasks on the Fuseki server.
     */
    getTasks() {
        return axios.get(this.getFusekiUrl('/$/tasks'));
    }



    /**
     * Counts the triples in the graph represented by the dataset.
     * @param datasetName The name of the target dataset.
     * @param endpoint The endpoint of the dataset.
     * @returns A promise for the the amonut of counted graph triples.
     */
    countGraphsTriples = async (datasetName: string, endpoint: string) => {
        const promisesResult = await Promise.all([
            axios.get(this.getFusekiUrl(`/${datasetName}/${endpoint}`), {
                params: {
                    query: DATASET_SIZE_QUERY_1,
                },
            }),
            axios.get(this.getFusekiUrl(`/${datasetName}/${endpoint}`), {
                params: {
                    query: DATASET_SIZE_QUERY_2,
                },
            }),
        ]);
        const results: any = {};
        const defaultGraphResult = promisesResult[0];
        results.default = defaultGraphResult.data.results.bindings[0].count.value;
        const allGraphResult = promisesResult[1];
        allGraphResult.data.results.bindings.forEach((binding: any) => {
            results[binding.g.value] = binding.count.value;
        });
        return results;
    };



    /**
     * @param datasetName The name of the target dataset.
     * @param graphName The name of the graph represented by the dataset.
     * @returns A promise containing the current graph of the dataset.
     */  
    fetchGraph = async (datasetName: string, graphName: string) => {
        return (await axios.get(this.getFusekiUrl(`/${datasetName}`), {
            params: { graph: graphName, },
            headers: { Accept: 'text/turtle; charset=utf-8', },
        })).data;
    };


    
    saveGraph = async (datasetName: string, graphName: string, code: string) => {
        return await axios
            .put(this.getFusekiUrl(`/${datasetName}`), code, {
                params: { graph: graphName, },
                headers: {
                    Accept: 'application/json, text/javascript, */*; q=0.01',
                    'Content-Type': 'text/turtle; charset=UTF-8',
                },
            })
            .catch((error) => {
                throw new Error(error.response.data);
            });
    };
}

// Types
interface GetServerDataResponse {
    version: string;
    built: string;
    startDateTime: string;
    uptime: number;
    datasets ? : DatasetsEntity[] | null;
}

interface DatasetsEntity {
    'ds.name': string;
    'ds.state': boolean;
    'ds.services' ? : DsServicesEntity[] | null;
}

interface DsServicesEntity {
    'srv.type': string;
    'srv.description': string;
    'srv.endpoints' ? : string[] | null;
}

export interface FusekiQueryResult {
    head: {
        vars: string[];
    };
    results: {
        bindings: FusekiQueryBindings[];
    };
}

export type FusekiQueryBindings = {
    [key: string]: FusekiQueryBinding;
};

export type FusekiQueryBinding = {
    type: FusekiObjectType;
    value: string;
    datatype ? : string;
};

export type FusekiObjectType = 'bnode' | 'literal' | 'uri';

export type FusekiExpansionQueryBindings = {
    subject: FusekiQueryBinding;
    predicate: FusekiQueryBinding;
    object: FusekiQueryBinding;
};

export type FusekiExpansionQueryResults = {
    head: {
        vars: string[];
    };
    results: {
        bindings: FusekiExpansionQueryBindings[];
    };
};