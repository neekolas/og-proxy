import { load } from "cheerio";
import { TAG_PREFIXES } from "./constants";

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

function extractMetaTags(html: string, tagPrefixes = TAG_PREFIXES) {
  const $ = load(html);
  const metaTags = $("meta");
  const metaTagsArray = Array.from(metaTags);

  return metaTagsArray.reduce((acc: { [k: string]: string }, metaTag) => {
    const property = metaTag.attribs.property;
    const content = metaTag.attribs.content;

    if (!property || !content) {
      return acc;
    }

    const hasPrefix = tagPrefixes.some((prefix) =>
      property.trim().startsWith(prefix)
    );

    if (!hasPrefix) {
      return acc;
    }

    return { ...acc, [property]: content };
  }, {});
}
