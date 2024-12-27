import { DOMParser } from "@b-fuze/deno-dom";

const parser = new DOMParser();
export function parseXML(tagName: string, xmlString: string) {
  const xmlDoc = parser.parseFromString(xmlString, "text/html");

  return xmlDoc.getElementsByTagName(tagName)[0].textContent;
}
