import { load } from "cheerio";
import { TAG_PREFIXES } from "./constants";

export function extractMetaTags(html: string, tagPrefixes = TAG_PREFIXES) {
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
