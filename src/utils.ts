import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";

/**
 * @description Helper function to safely check if a string is a valid
 * HTTP/HTTPS URL.
 *
 * @param { string } value - The string to validate against.
 *
 * @returns { boolean } Returns true if `value` is a valid URL, false otherwise.
 */
function isValidURL(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * @description Converts a JavaScript `Date` object into a valid RSS-approved
 * date string.
 *
 * RSS 2.0 requires the date values to be formatted using the RFC 822 format,
 * which is achieved via the `Date.prototype.toUTCString()` method. If the
 * provided value is `undefined`, `null`, or not a `Date` instance, no output is
 * returned to ensure optional date fields are omitted in the rendered XML
 * output.
 *
 * @param { Date | null | undefined } date - The date value to format. May be a
 *   `Date` object, `null`, or `undefined`.
 *
 * @returns { string | undefined } A UTC-formatted date string if `date` is a
 *   valid `Date` instance, otherwise `undefined` allowing the caller to skip
 *   serialization.
 */
function formatDate(date?: Date): string | undefined {
  return date instanceof Date ? date.toUTCString() : undefined;
}

/**
 * @description Conditionally applies the `isPermaLink` attribute to `guid`
 * elements.
 *
 * If the element name is `'guid'`, this method checks whether the provided
 * value is a valid URL and sets the `isPermaLink` attribute to `"true"` or
 * `"false"` accordingly.
 *
 * @param { XMLBuilder } element - The XML builder instance for the current
 *   element.
 * @param { string } name - The name of the XML element.
 * @param { string } value - The string value of the element to test for URL
 *   validity.
 *
 * @returns { void }
 */
function handleGUIDAttribute(
  element: XMLBuilder,
  name: string,
  value: string,
): void {
  if (name === "guid") {
    element.att("isPermaLink", isValidURL(value) ? "true" : "false");
  }
}

/**
 * @description Matches characters outside the XML 1.0 `Char` production, which
 * would make the generated document unparseable.
 *
 * @see https://www.w3.org/TR/xml/#charsets
 */
const INVALID_XML_CHARS =
  /[^\t\n\r\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu;

/**
 * @description Appends text content or a CDATA section to the provided XML
 * element.
 *
 * By default, text content is safely escaped using `.txt()`. If `cdata` is set
 * to `true` or if HTML/markup tags are automatically detected in the value, the
 * content is wrapped in a CDATA section (`<![CDATA[...]]>`) using `.dat()`. A
 * value containing `]]>` cannot live inside CDATA, so it is always escaped with
 * `.txt()` instead. Characters that XML 1.0 does not allow (e.g. most control
 * characters) are removed first.
 *
 * @param { XMLBuilder } element - The XML builder instance to append content
 *   to.
 * @param { string } value - The string content to append.
 * @param { boolean } [cdata] - Optional flag to force CDATA wrapping.
 *
 * @returns { void }
 */
function appendContent(
  element: XMLBuilder,
  value: string,
  cdata?: boolean,
): void {
  const text = value.replaceAll(INVALID_XML_CHARS, "");
  const shouldUseCdata =
    !text.includes("]]>") && (cdata || /<[a-z][\s\S]*>/iu.test(text));

  if (shouldUseCdata) {
    element.dat(text);
  } else {
    element.txt(text);
  }
}

export { isValidURL, formatDate, handleGUIDAttribute, appendContent };
