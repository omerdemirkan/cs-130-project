/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios, { isAxiosError } from "axios";
import qs from "qs";

const DATASET_SIZE_QUERY_1 = "select (count(*) as ?count) {?s ?p ?o}";
const DATASET_SIZE_QUERY_2 =
  "select ?g (count(*) as ?count) {graph ?g {?s ?p ?o}} group by ?g";

class FusekiService {
  isOffline: boolean;
  pathname: string;
  constructor(location: Location) {
    this.isOffline = true;
    this.pathname = location.pathname;
  }

  getFusekiUrl(url: string) {
    // remove leading `/`'s
    let normalizedUrl = url;
    while (normalizedUrl.startsWith("/") && normalizedUrl.length > 0) {
      normalizedUrl = normalizedUrl.slice(1);
    }
    const pathname = this.pathname.endsWith("/")
      ? this.pathname
      : `${this.pathname}/`;
    return `${pathname}${normalizedUrl}`;
  }

  async getServerData() {
    const response = await axios.get(this.getFusekiUrl("/$/server"));
    return response.data;
  }

  async getServerStatus() {
    const startTime = new Date().getTime();
    try {
      await axios.get(this.getFusekiUrl("/$/ping"));

      this.isOffline = false;
      return true;
    } catch (error) {
      this.isOffline = true;
      return false;
    }
  }

  // _duration(startTime) {
  //   return new Date().getTime() - startTime;
  // }

  async getDatasetStats(datasetName: string) {
    const response = await axios.get(
      this.getFusekiUrl(`/$/stats/${datasetName}`)
    );
    return response.data;
  }

  async getDatasetSize(datasetName: string, endpoint: string) {
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

    const results = {};
    const defaultGraphResult = promisesResult[0];
    results["default graph"] =
      defaultGraphResult.data.results.bindings[0].count.value;
    const allGraphResult = promisesResult[1];
    allGraphResult.data.results.bindings.forEach((binding) => {
      results[binding.g.value] = binding.count.value;
    });
    return results;
  }

  async deleteDataset(datasetName: string) {
    await axios.delete(this.getFusekiUrl(`/$/datasets${datasetName}`));
  }

  async backupDataset(datasetName: string) {
    return await axios.post(this.getFusekiUrl(`/$/backup${datasetName}`));
  }

  async createDataset(datasetName: string, datasetType: string) {
    const data = qs.stringify({
      dbName: datasetName,
      dbType: datasetType,
    });
    // const data = new FormData()
    // data.set('dbName', datasetName)
    // data.set('dbType', datasetType)
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    try {
      await axios.post(this.getFusekiUrl("/$/datasets"), data, {
        headers,
      });
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status !== 200) {
          if (error.response.status === 409) {
            throw new Error(
              `failed to create dataset "${datasetName}", reason: there is another dataset with the same name`
            );
          }
          throw new Error(
            `failed to create dataset "${datasetName}" with type ${datasetType}, reason: HTTP status: "${error.response.status}", message: ${error.response.statusText}`
          );
        }
      }
      throw error;
    }
  }

  async getTasks() {
    return axios.get(this.getFusekiUrl("/$/tasks"));
  }

  async countGraphsTriples(datasetName: string, endpoint: string) {
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
    const results = {};
    const defaultGraphResult = promisesResult[0];
    results.default = defaultGraphResult.data.results.bindings[0].count.value;
    const allGraphResult = promisesResult[1];
    allGraphResult.data.results.bindings.forEach((binding) => {
      results[binding.g.value] = binding.count.value;
    });
    return results;
  }

  async fetchGraph(datasetName: string, graphName: string) {
    return await axios.get(this.getFusekiUrl(`/${datasetName}`), {
      params: {
        graph: graphName,
      },
      headers: {
        Accept: "text/turtle; charset=utf-8",
      },
    });
  }

  async saveGraph(datasetName: string, graphName: string, code: string) {
    return await axios
      .put(this.getFusekiUrl(`/${datasetName}`), code, {
        params: {
          graph: graphName,
        },
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "text/turtle; charset=UTF-8",
        },
      })
      .catch((error) => {
        throw new Error(error.response.data);
      });
  }
}

export default FusekiService;
