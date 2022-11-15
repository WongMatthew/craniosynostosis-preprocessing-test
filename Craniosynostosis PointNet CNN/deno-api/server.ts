//simple deno server
import { Application, Router, base64Decode, base64Encode } from "./deps.ts";
import { RegisterPayload, User } from "./interfaces.ts";

const router = new Router();
const app = new Application();
const usersMap = new Map<string, User>();

//take in Register Payload and use it to create new User

router.get("/", (ctx) => {
  ctx.response.body = "Hello from Oak";
  // console.log(ctx);
});

router.post("/", async (ctx) => {
  const body = await ctx.request.body({ type: "form-data" });
  const formData = await body.value.read();
  console.log(formData.fields);
  console.log(ctx.request.headers);
  const { username, password } = formData.fields;
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const textEncoder = new TextEncoder();

  //  1. Register

  const uInt8Password = new TextEncoder().encode(password);
  const salt = await crypto.getRandomValues(new Uint8Array(16));
  const importedKey = await crypto.subtle.importKey(
    "raw",
    uInt8Password,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    importedKey,
    256
  );

  const stringifiedBits = base64Encode(new Uint8Array(derivedBits));
  const encodedHeader = base64Encode(
    textEncoder.encode(JSON.stringify(header))
  );
  const encodedPayload = base64Encode(
    textEncoder.encode(JSON.stringify({ username, hash: stringifiedBits }))
  );
  const secret = "ahhhhhhhhhh";

  console.log(encodedHeader);
  console.log(encodedPayload);

  const signature = await crypto.subtle.sign(
    { name: "HMAC", hash: { name: "SHA-256" } },
    await crypto.subtle.importKey(
      "raw",
      textEncoder.encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } },
      true,
      ["sign", "verify"]
    ),
    textEncoder.encode(`${encodedHeader}.${encodedPayload}`)
  );

  console.log("SIGNATURE: ", signature);
  //derive bits from password and salt

  // get the register payload\

  //transform with webcrypto api to hash
  //store in map
  //return user

  // map.set('1', 'a')
  // map.set('1', { name: alice, password: '123' })

  ctx.response.redirect("/");
});

app.use(router.routes()).use(router.allowedMethods());

app.listen({ port: 8000 });
