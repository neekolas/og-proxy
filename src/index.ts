import { PORT } from "./constants.ts";
import { downloadAndExtract } from "./parser.ts";

console.log(`Starting server on port ${PORT}`);

async function handleGet(req: Request) {
  const url = new URL(req.url).searchParams.get("url");
  console.log(`Processing request for ${url}`);
  if (!url) {
    return new Response("Missing url query param", { status: 400 });
  }
  const data = await downloadAndExtract(url);
  console.log(`Extracted: ${data}`);

  return Response.json(
    {
      url,
      extractedTags: data,
    },
    {
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
    }
  );
}

Bun.serve({
  port: PORT,
  fetch(req) {
    if (req.method === "GET") {
      return handleGet(req);
    }

    return new Response("Not implemented", { status: 501 });
  },
});
