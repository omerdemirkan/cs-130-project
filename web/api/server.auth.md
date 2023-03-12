# Module: server/auth

## Table of contents

### Functions

- [getServerAuthSession](../wiki/server.auth#getserverauthsession)

## Functions

### getServerAuthSession

▸ **getServerAuthSession**(`ctx`): `Promise`<`null` \| `Session`\>

Wrapper for unstable_getServerSession, used in trpc createContext and the
restricted API route

Don't worry too much about the "unstable", it's safe to use but the syntax
may change in future versions

**`See`**

https://next-auth.js.org/configuration/nextjs

#### Parameters

| Name      | Type                                                                          |
| :-------- | :---------------------------------------------------------------------------- |
| `ctx`     | `Object`                                                                      |
| `ctx.req` | `IncomingMessage` & { `cookies`: `Partial`<{ `[key: string]`: `string`; }\> } |
| `ctx.res` | `ServerResponse`<`IncomingMessage`\>                                          |

#### Returns

`Promise`<`null` \| `Session`\>

#### Defined in

[src/server/auth.ts:16](https://github.com/omerdemirkan/cs-130-project/blob/c363b4d/web/src/server/auth.ts#L16)
