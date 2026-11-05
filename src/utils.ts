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
 * output. An invalid `Date` (e.g. `new Date("not a date")`) throws instead of
 * being serialized as `Invalid Date`.
 *
 * @param { Date | null | undefined } date - The date value to format. May be a
 *   `Date` object, `null`, or `undefined`.
 * @param { string } [field] - The name of the field being formatted, used in
 *   the error message.
 *
 * @returns { string | undefined } A UTC-formatted date string if `date` is a
 *   valid `Date` instance, otherwise `undefined` allowing the caller to skip
 *   serialization.
 * @throws { RangeError } If `date` is an invalid `Date`.
 */
function formatDate(date?: Date, field = "date"): string | undefined {
  if (!(date instanceof Date)) {
    return undefined;
  }

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid Date provided for "${field}"`);
  }

  return date.toUTCString();
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
 * @description Appends text content or a CDATA section to the provided XML
 * element.
 *
 * By default, text content is safely escaped using `.txt()`. If `cdata` is set
 * to `true` or if HTML/markup tags are automatically detected in the value, the
 * content is wrapped in a CDATA section (`<![CDATA[...]]>`) using `.dat()`.
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
  const shouldUseCdata = cdata || /<[a-z][\s\S]*>/iu.test(value);

  if (shouldUseCdata) {
    element.dat(value);
  } else {
    element.txt(value);
  }
}

/**
 * @description Returns the MIME type for the `xml-stylesheet` processing
 * instruction based on the stylesheet URL.
 *
 * A URL whose path ends in `.css` is typed as `text/css` and anything else is
 * treated as an XSL stylesheet.
 *
 * @param { URL } url - The URL of the stylesheet.
 *
 * @returns { "text/css" | "text/xsl" } The stylesheet MIME type.
 */
function getStylesheetType(url: URL): "text/css" | "text/xsl" {
  return url.pathname.toLowerCase().endsWith(".css") ? "text/css" : "text/xsl";
}

export {
  isValidURL,
  formatDate,
  handleGUIDAttribute,
  appendContent,
  getStylesheetType,
};
