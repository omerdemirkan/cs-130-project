# Module: utils/fuseki

## Table of contents

### Classes

- [FusekiService](../wiki/utils.fuseki.FusekiService)

### Interfaces

- [FusekiQueryResult](../wiki/utils.fuseki.FusekiQueryResult)

### Type Aliases

- [FusekiExpansionQueryBindings](../wiki/utils.fuseki#fusekiexpansionquerybindings)
- [FusekiExpansionQueryResults](../wiki/utils.fuseki#fusekiexpansionqueryresults)
- [FusekiObjectType](../wiki/utils.fuseki#fusekiobjecttype)
- [FusekiQueryBinding](../wiki/utils.fuseki#fusekiquerybinding)
- [FusekiQueryBindings](../wiki/utils.fuseki#fusekiquerybindings)

## Type Aliases

### FusekiExpansionQueryBindings

Ƭ **FusekiExpansionQueryBindings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `object` | [`FusekiQueryBinding`](../wiki/utils.fuseki#fusekiquerybinding) |
| `predicate` | [`FusekiQueryBinding`](../wiki/utils.fuseki#fusekiquerybinding) |
| `subject` | [`FusekiQueryBinding`](../wiki/utils.fuseki#fusekiquerybinding) |

#### Defined in

[src/utils/fuseki.ts:366](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L366)

___

### FusekiExpansionQueryResults

Ƭ **FusekiExpansionQueryResults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `head` | { `vars`: `string`[]  } |
| `head.vars` | `string`[] |
| `results` | { `bindings`: [`FusekiExpansionQueryBindings`](../wiki/utils.fuseki#fusekiexpansionquerybindings)[]  } |
| `results.bindings` | [`FusekiExpansionQueryBindings`](../wiki/utils.fuseki#fusekiexpansionquerybindings)[] |

#### Defined in

[src/utils/fuseki.ts:372](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L372)

___

### FusekiObjectType

Ƭ **FusekiObjectType**: ``"bnode"`` \| ``"literal"`` \| ``"uri"``

#### Defined in

[src/utils/fuseki.ts:364](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L364)

___

### FusekiQueryBinding

Ƭ **FusekiQueryBinding**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `datatype?` | `string` |
| `type` | [`FusekiObjectType`](../wiki/utils.fuseki#fusekiobjecttype) |
| `value` | `string` |

#### Defined in

[src/utils/fuseki.ts:358](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L358)

___

### FusekiQueryBindings

Ƭ **FusekiQueryBindings**: `Object`

#### Index signature

▪ [key: `string`]: [`FusekiQueryBinding`](../wiki/utils.fuseki#fusekiquerybinding)

#### Defined in

[src/utils/fuseki.ts:354](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/utils/fuseki.ts#L354)
