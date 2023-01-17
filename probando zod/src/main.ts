import { Application, Router } from "oak";

import { removeSlot } from "./resolvers/delete.ts";
import { availableSlots } from "./resolvers/get.ts";
import { addSlot } from "./resolvers/post.ts";
import { bookSlot } from "./resolvers/put.ts";

const router = new Router();
const port = Number(Deno.env.get("PORT"));

router
  .post("/addSlot", addSlot)
  .delete("/removeSlot", removeSlot)
  .get("/availableSlots", availableSlots)
  .put("/bookSlot", bookSlot);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

//obtener puerto de env

await app.listen({ port: port });

console.log(`Server running on: http://localhost:${port}/graphql`);
