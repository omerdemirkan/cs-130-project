# Module: client/store/graph

## Table of contents

### Type Aliases

- [GraphEdge](../wiki/client.store.graph#graphedge)
- [GraphNode](../wiki/client.store.graph#graphnode)

### Functions

- [processFusekiExpansionQueryResults](../wiki/client.store.graph#processfusekiexpansionqueryresults)
- [useGraphStore](../wiki/client.store.graph#usegraphstore)

## Type Aliases

### GraphEdge

Ƭ **GraphEdge**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `label` | `string` |
| `source` | `string` |
| `target` | `string` |

#### Defined in

[src/client/store/graph.ts:14](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/client/store/graph.ts#L14)

___

### GraphNode

Ƭ **GraphNode**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fusekiObjectType` | [`FusekiObjectType`](../wiki/utils.fuseki#fusekiobjecttype) |
| `id` | `string` |
| `label` | `string` |

#### Defined in

[src/client/store/graph.ts:8](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/client/store/graph.ts#L8)

## Functions

### processFusekiExpansionQueryResults

▸ **processFusekiExpansionQueryResults**(`«destructured»`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `existingEdges?` | [`GraphEdge`](../wiki/client.store.graph#graphedge)[] |
| › `existingNodes?` | [`GraphNode`](../wiki/client.store.graph#graphnode)[] |
| › `fusekiQueryResult` | [`FusekiExpansionQueryResults`](../wiki/utils.fuseki#fusekiexpansionqueryresults) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `newEdges` | [`GraphEdge`](../wiki/client.store.graph#graphedge)[] |
| `newNodes` | [`GraphNode`](../wiki/client.store.graph#graphnode)[] |

#### Defined in

[src/client/store/graph.ts:51](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/client/store/graph.ts#L51)

___

### useGraphStore

▸ **useGraphStore**(): `GraphStoreState`

#### Returns

`GraphStoreState`

#### Defined in

node_modules/zustand/react.d.ts:11

▸ **useGraphStore**<`U`\>(`selector`, `equals?`): `U`

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | (`state`: `GraphStoreState`) => `U` |
| `equals?` | (`a`: `U`, `b`: `U`) => `boolean` |

#### Returns

`U`

#### Defined in

node_modules/zustand/react.d.ts:12
