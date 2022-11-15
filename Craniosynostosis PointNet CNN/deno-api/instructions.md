Deno Pokemon API (Part 1)

1. Auth
   1. Register
   2. Login
   3. Verify logged in

2. "Product API" - Pokemon
   1. Return pokemon info
   2. Need to be authed
   3. Create a public non-authed stripped down version

Pokemon Info:
1. In-memory hardcoded to start w/ 3 pokemon
2. Future we'll reach out to the pokeapi to get data if not cached locally

User Info:
1. In-memory (Map)
2. Registered users stored in the map, with their auth key

Dependencies (deps.ts):

- serve (std/http/server.ts)
- Application, Router, Context (Oak 3rd party lib)
- encode, decode (std/encoding/base64.ts)

User Flow:

Register -> Get a auth token/string/cookie -> Login -> Access Pokemon Resource

Routes:

User:
POST /register
POST /login

Pokemon:
GET / (require auth)


Interfaces:

```ts
interface User {
    username: string;
    hash: string;
    salt: string;
    createdAt: Date;
}

interface RegisterPayload {
    username: string;
    password: string;
}
```

```ts
interface Pokemon {
    id: string;
    name: string;
    height: number;
    weight: number;
}
```

Functions:

```ts
// Auth
// crypto module std lib (web api)
// encode base64
// Encoding api
const generateSalt = () : string;
const hashWithSalt = async (password: string, salt: string) : string;
```
