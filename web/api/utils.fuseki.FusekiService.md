# Class: FusekiService

[utils/fuseki](../wiki/utils.fuseki).FusekiService

## Table of contents

### Constructors

- [constructor](../wiki/utils.fuseki.FusekiService#constructor)

### Properties

- [isOffline](../wiki/utils.fuseki.FusekiService#isoffline)
- [pathname](../wiki/utils.fuseki.FusekiService#pathname)

### Methods

- [backupDataset](../wiki/utils.fuseki.FusekiService#backupdataset)
- [countGraphsTriples](../wiki/utils.fuseki.FusekiService#countgraphstriples)
- [createDataset](../wiki/utils.fuseki.FusekiService#createdataset)
- [deleteDataset](../wiki/utils.fuseki.FusekiService#deletedataset)
- [expansionQueryDataset](../wiki/utils.fuseki.FusekiService#expansionquerydataset)
- [fetchGraph](../wiki/utils.fuseki.FusekiService#fetchgraph)
- [getAsObjectExpansionQuery](../wiki/utils.fuseki.FusekiService#getasobjectexpansionquery)
- [getAsSubjectExpansionQuery](../wiki/utils.fuseki.FusekiService#getassubjectexpansionquery)
- [getDatasetSize](../wiki/utils.fuseki.FusekiService#getdatasetsize)
- [getDatasetStats](../wiki/utils.fuseki.FusekiService#getdatasetstats)
- [getFusekiUploadUrl](../wiki/utils.fuseki.FusekiService#getfusekiuploadurl)
- [getFusekiUrl](../wiki/utils.fuseki.FusekiService#getfusekiurl)
- [getNodeQueryStrRepresentation](../wiki/utils.fuseki.FusekiService#getnodequerystrrepresentation)
- [getServerData](../wiki/utils.fuseki.FusekiService#getserverdata)
- [getServerStatus](../wiki/utils.fuseki.FusekiService#getserverstatus)
- [getTasks](../wiki/utils.fuseki.FusekiService#gettasks)
- [queryDataset](../wiki/utils.fuseki.FusekiService#querydataset)
- [saveGraph](../wiki/utils.fuseki.FusekiService#savegraph)

## Constructors

### constructor

• **new FusekiService**(`pathname`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathname` | `string` |

#### Defined in

[src/utils/fuseki.ts:28](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L28)

## Properties

### isOffline

• **isOffline**: `boolean`

#### Defined in

[src/utils/fuseki.ts:26](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L26)

___

### pathname

• **pathname**: `string`

#### Defined in

[src/utils/fuseki.ts:27](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L27)

## Methods

### backupDataset

▸ **backupDataset**(`datasetName`): `Promise`<`AxiosResponse`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |

#### Returns

`Promise`<`AxiosResponse`<`any`, `any`\>\>

#### Defined in

[src/utils/fuseki.ts:224](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L224)

___

### countGraphsTriples

▸ **countGraphsTriples**(`datasetName`, `endpoint`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |
| `endpoint` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/fuseki.ts:277](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L277)

___

### createDataset

▸ **createDataset**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `datasetName` | `string` |
| › `datasetType` | ``"tdb2"`` \| ``"mem"`` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/utils/fuseki.ts:230](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L230)

___

### deleteDataset

▸ **deleteDataset**(`datasetName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/utils/fuseki.ts:218](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L218)

___

### expansionQueryDataset

▸ **expansionQueryDataset**(`«destructured»`): `Promise`<[`FusekiExpansionQueryResults`](../wiki/utils.fuseki#fusekiexpansionqueryresults)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `datasetName` | `string` |
| › `expansionNode` | [`GraphNode`](../wiki/client.store.graph#graphnode) |

#### Returns

`Promise`<[`FusekiExpansionQueryResults`](../wiki/utils.fuseki#fusekiexpansionqueryresults)\>

#### Defined in

[src/utils/fuseki.ts:106](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L106)

___

### fetchGraph

▸ **fetchGraph**(`datasetName`, `graphName`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |
| `graphName` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/fuseki.ts:302](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L302)

___

### getAsObjectExpansionQuery

▸ `Private` **getAsObjectExpansionQuery**(`expansionNode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expansionNode` | [`GraphNode`](../wiki/client.store.graph#graphnode) |

#### Returns

`string`

#### Defined in

[src/utils/fuseki.ts:179](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L179)

___

### getAsSubjectExpansionQuery

▸ `Private` **getAsSubjectExpansionQuery**(`expansionNode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expansionNode` | [`GraphNode`](../wiki/client.store.graph#graphnode) |

#### Returns

`string`

#### Defined in

[src/utils/fuseki.ts:154](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L154)

___

### getDatasetSize

▸ **getDatasetSize**(`datasetName`, `endpoint`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |
| `endpoint` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/fuseki.ts:191](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L191)

___

### getDatasetStats

▸ **getDatasetStats**(`datasetName`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/fuseki.ts:77](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L77)

___

### getFusekiUploadUrl

▸ **getFusekiUploadUrl**(`datasetName`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |

#### Returns

`string`

#### Defined in

[src/utils/fuseki.ts:49](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L49)

___

### getFusekiUrl

▸ **getFusekiUrl**(`url`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`string`

#### Defined in

[src/utils/fuseki.ts:35](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L35)

___

### getNodeQueryStrRepresentation

▸ `Private` **getNodeQueryStrRepresentation**(`expansionNode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expansionNode` | [`GraphNode`](../wiki/client.store.graph#graphnode) |

#### Returns

`string`

#### Defined in

[src/utils/fuseki.ts:166](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L166)

___

### getServerData

▸ **getServerData**(): `Promise`<`GetServerDataResponse`\>

#### Returns

`Promise`<`GetServerDataResponse`\>

#### Defined in

[src/utils/fuseki.ts:55](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L55)

___

### getServerStatus

▸ **getServerStatus**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/utils/fuseki.ts:62](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L62)

___

### getTasks

▸ **getTasks**(): `Promise`<`AxiosResponse`<`any`, `any`\>\>

#### Returns

`Promise`<`AxiosResponse`<`any`, `any`\>\>

#### Defined in

[src/utils/fuseki.ts:271](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L271)

___

### queryDataset

▸ **queryDataset**(`«destructured»`): `Promise`<[`FusekiQueryResult`](../wiki/utils.fuseki.FusekiQueryResult)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `datasetName` | `string` |
| › `query` | `string` |

#### Returns

`Promise`<[`FusekiQueryResult`](../wiki/utils.fuseki.FusekiQueryResult)\>

#### Defined in

[src/utils/fuseki.ts:86](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L86)

___

### saveGraph

▸ **saveGraph**(`datasetName`, `graphName`, `code`): `Promise`<`AxiosResponse`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetName` | `string` |
| `graphName` | `string` |
| `code` | `string` |

#### Returns

`Promise`<`AxiosResponse`<`any`, `any`\>\>

#### Defined in

[src/utils/fuseki.ts:311](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L311)
