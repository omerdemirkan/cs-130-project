# Module: server/api/trpc

## Table of contents

### Variables

- [protectedProcedure](../wiki/server.api.trpc#protectedprocedure)
- [publicProcedure](../wiki/server.api.trpc#publicprocedure)

### Functions

- [createTRPCContext](../wiki/server.api.trpc#createtrpccontext)
- [createTRPCRouter](../wiki/server.api.trpc#createtrpcrouter)

## Variables

### protectedProcedure

• `Const` **protectedProcedure**: `CreateProcedureReturnInput`<{ `_config`: `RootConfig`<{ `ctx`: { `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session } ; `errorShape`: `DefaultErrorShape` ; `meta`: `object` ; `transformer`: { `allowErrorProps`: (...`props`: `string`[]) => `void` ; `deserialize`: <T_1\>(`payload`: `SuperJSONResult`) => `T_1` ; `parse`: <T\>(`string`: `string`) => `T` ; `registerClass`: (`v`: `Class`, `options?`: `string` \| `RegisterOptions`) => `void` ; `registerCustom`: <I, O\>(`transformer`: `Omit`<`CustomTransfomer`<`I`, `O`\>, `"name"`\>, `name`: `string`) => `void` ; `registerSymbol`: (`v`: `Symbol`, `identifier?`: `string`) => `void` ; `serialize`: (`object`: `any`) => `SuperJSONResult` ; `stringify`: (`object`: `any`) => `string` } }\> ; `_ctx_out`: { `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session } ; `_input_in`: typeof `unsetMarker` ; `_input_out`: typeof `unsetMarker` ; `_meta`: `object` ; `_output_in`: typeof `unsetMarker` ; `_output_out`: typeof `unsetMarker` }, { `_config`: `RootConfig`<{ `ctx`: { `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session } ; `errorShape`: `DefaultErrorShape` ; `meta`: `object` ; `transformer`: { `allowErrorProps`: (...`props`: `string`[]) => `void` ; `deserialize`: <T_1\>(`payload`: `SuperJSONResult`) => `T_1` ; `parse`: <T\>(`string`: `string`) => `T` ; `registerClass`: (`v`: `Class`, `options?`: `string` \| `RegisterOptions`) => `void` ; `registerCustom`: <I, O\>(`transformer`: `Omit`<`CustomTransfomer`<`I`, `O`\>, `"name"`\>, `name`: `string`) => `void` ; `registerSymbol`: (`v`: `Symbol`, `identifier?`: `string`) => `void` ; `serialize`: (`object`: `any`) => `SuperJSONResult` ; `stringify`: (`object`: `any`) => `string` } }\> ; `_ctx_out`: { `session`: { `expires`: `string` ; `user`: { `id`: `string` } & { `email?`: `null` \| `string` ; `image?`: `null` \| `string` ; `name?`: `null` \| `string` } = ctx.session.user } } ; `_input_in`: `unknown` ; `_input_out`: `unknown` ; `_meta`: `object` ; `_output_in`: `unknown` ; `_output_out`: `unknown` }\>

Protected (authed) procedure

If you want a query or mutation to ONLY be accessible to logged in users, use
this. It verifies the session is valid and guarantees ctx.session.user is not
null

**`See`**

https://trpc.io/docs/procedures

#### Defined in

[src/server/api/trpc.ts:124](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/server/api/trpc.ts#L124)

---

### publicProcedure

• `Const` **publicProcedure**: `ProcedureBuilder`<{ `_config`: `RootConfig`<{ `ctx`: { `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session } ; `errorShape`: `DefaultErrorShape` ; `meta`: `object` ; `transformer`: { `allowErrorProps`: (...`props`: `string`[]) => `void` ; `deserialize`: <T_1\>(`payload`: `SuperJSONResult`) => `T_1` ; `parse`: <T\>(`string`: `string`) => `T` ; `registerClass`: (`v`: `Class`, `options?`: `string` \| `RegisterOptions`) => `void` ; `registerCustom`: <I, O\>(`transformer`: `Omit`<`CustomTransfomer`<`I`, `O`\>, `"name"`\>, `name`: `string`) => `void` ; `registerSymbol`: (`v`: `Symbol`, `identifier?`: `string`) => `void` ; `serialize`: (`object`: `any`) => `SuperJSONResult` ; `stringify`: (`object`: `any`) => `string` } }\> ; `_ctx_out`: { `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session } ; `_input_in`: typeof `unsetMarker` ; `_input_out`: typeof `unsetMarker` ; `_meta`: `object` ; `_output_in`: typeof `unsetMarker` ; `_output_out`: typeof `unsetMarker` }\> = `t.procedure`

Public (unauthed) procedure

This is the base piece you use to build new queries and mutations on your
tRPC API. It does not guarantee that a user querying is authorized, but you
can still access user session data if they are logged in

#### Defined in

[src/server/api/trpc.ts:97](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/server/api/trpc.ts#L97)

## Functions

### createTRPCContext

▸ **createTRPCContext**(`opts`): `Promise`<{ `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session }\>

This is the actual context you'll use in your router. It will be used to
process every request that goes through your tRPC endpoint

**`Link`**

https://trpc.io/docs/context

#### Parameters

| Name   | Type                       |
| :----- | :------------------------- |
| `opts` | `CreateNextContextOptions` |

#### Returns

`Promise`<{ `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session }\>

#### Defined in

[src/server/api/trpc.ts:50](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/server/api/trpc.ts#L50)

---

### createTRPCRouter

▸ **createTRPCRouter**<`TProcRouterRecord`\>(`procedures`): `CreateRouterInner`<`RootConfig`<{ `ctx`: { `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session } ; `errorShape`: `DefaultErrorShape` ; `meta`: `object` ; `transformer`: { `allowErrorProps`: (...`props`: `string`[]) => `void` ; `deserialize`: <T_1\>(`payload`: `SuperJSONResult`) => `T_1` ; `parse`: <T\>(`string`: `string`) => `T` ; `registerClass`: (`v`: `Class`, `options?`: `string` \| `RegisterOptions`) => `void` ; `registerCustom`: <I, O\>(`transformer`: `Omit`<`CustomTransfomer`<`I`, `O`\>, `"name"`\>, `name`: `string`) => `void` ; `registerSymbol`: (`v`: `Symbol`, `identifier?`: `string`) => `void` ; `serialize`: (`object`: `any`) => `SuperJSONResult` ; `stringify`: (`object`: `any`) => `string` } }\>, `TProcRouterRecord`\>

This is how you create new routers and subrouters in your tRPC API

**`See`**

https://trpc.io/docs/router

#### Type parameters

| Name                | Type                            |
| :------------------ | :------------------------------ |
| `TProcRouterRecord` | extends `ProcedureRouterRecord` |

#### Parameters

| Name         | Type                |
| :----------- | :------------------ |
| `procedures` | `TProcRouterRecord` |

#### Returns

`CreateRouterInner`<`RootConfig`<{ `ctx`: { `prisma`: `PrismaClient`<`PrismaClientOptions`, `never`, `undefined` \| `RejectOnNotFound` \| `RejectPerOperation`\> ; `session`: `null` \| `Session` = opts.session } ; `errorShape`: `DefaultErrorShape` ; `meta`: `object` ; `transformer`: { `allowErrorProps`: (...`props`: `string`[]) => `void` ; `deserialize`: <T_1\>(`payload`: `SuperJSONResult`) => `T_1` ; `parse`: <T\>(`string`: `string`) => `T` ; `registerClass`: (`v`: `Class`, `options?`: `string` \| `RegisterOptions`) => `void` ; `registerCustom`: <I, O\>(`transformer`: `Omit`<`CustomTransfomer`<`I`, `O`\>, `"name"`\>, `name`: `string`) => `void` ; `registerSymbol`: (`v`: `Symbol`, `identifier?`: `string`) => `void` ; `serialize`: (`object`: `any`) => `SuperJSONResult` ; `stringify`: (`object`: `any`) => `string` } }\>, `TProcRouterRecord`\>

#### Defined in

node_modules/@trpc/server/dist/core/initTRPC.d.ts:88
