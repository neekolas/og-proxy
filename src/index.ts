import { CORS_HEADERS, PORT } from "./constants.ts";
import { handleGet, handlePost } from "./handlers.ts";

console.log(`Starting server on port ${PORT}`);

Bun.serve({
  port: PORT,
  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: CORS_HEADERS });
    }

    if (req.method === "GET") {
      return handleGet(req);
    }

    if (req.method === "POST") {
      return handlePost(req);
    }

    return new Response("Not implemented", { status: 501 });
  },
});

process.on("SIGINT", () => {
  console.log("Received SIGINT");
  process.exit(0);
});
