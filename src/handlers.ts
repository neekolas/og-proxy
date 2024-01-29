import { CORS_HEADERS } from "./constants";
import { extractMetaTags } from "./parser";

export async function handleGet(req: Request) {
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
        ...CORS_HEADERS,
      },
    }
  );
}

export async function handlePost(req: Request) {
  const url = new URL(req.url).searchParams.get("url");
  const body = await req.json();
  console.log(`Processing request for ${url}`);
  if (!url) {
    return new Response("Missing url query param", { status: 400 });
  }
  const data = await postAndExtract(url, body);
  console.log(`Extracted: ${data}`);

  return Response.json(
    {
      url,
      extractedTags: data,
    },
    {
      headers: {
        "content-type": "application/json",
        ...CORS_HEADERS,
      },
    }
  );
}

export async function postAndExtract(url: string, body: any) {
  const signal = AbortSignal.timeout(10000);
  const response = await fetch(url, {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    signal,
  });

  if (response.status >= 400) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const text = await response.text();
  return extractMetaTags(text);
}

export async function downloadAndExtract(url: string) {
  const signal = AbortSignal.timeout(10000);
  const response = await fetch(url, { redirect: "follow", signal });
  //   TODO: Better error handling
  if (response.status >= 400) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // TODO: Stream response until you see </head> and then stop
  const text = await response.text();
  return extractMetaTags(text);
}
