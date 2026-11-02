import { create } from "xmlbuilder2";
import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";

import type { ChannelElements, ItemElements, RSS } from "./types.ts";

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
 * @description Conditionally appends an XML element to the provided builder.
 *
 * This helper method avoids repititive null and undefined checks when
 * serializing channel or item fields. If the supplied `value` is defined, a new
 * XML element named `name` is created under `doc` and its text content is set
 * to the string representation of `value`. If the `value` is `undefined` or
 * `null`, the method performs no action, ensuring that RSS fields are omitted
 * entirely from the final output rather than appearing as empty tags.
 *
 * @param { XMLBuilder } doc - The current XML builder node to append the new
 *   element to.
 * @param { keyof ChannelElements | keyof ItemElements } name - The XML element
 *   name, restricted to a key declared on either {@link ChannelElements} or
 *   {@link ItemElements} so only RSS 2.0 sanctioned tags can be emitted.
 * @param { unknown } value - The value to serialize into the the element text
 *   content. If `undefined` or `null`, no element will be created.
 */
function buildNode(
  doc: XMLBuilder,
  name: keyof ChannelElements | keyof ItemElements,
  value: unknown,
): void {
  if (value === undefined || value === null) {
    return;
  }

  doc.ele(name).dat(String(value)).up();
}

/**
 * @description Represents an RSS feed generator instance.
 *
 * The `RSS` class stores channel-level metadata which describes the feed,
 * including required fields such as `title`, `link` and `description`, as well
 * as optional metadata like publication dates, editor information and
 * fetch/skip rules.
 */
export default class Feed implements RSS {
  /**
   * @description The RSS `<channel>` metadata used to describe the feed.
   *
   * This value is supplied when constructing the `RSS` instance and is stored
   * without modification. It is expected that validation, normalization or
   * transformation (if necessary) will be handled externally or in future
   * enhancements.
   */
  private readonly channelElements: ChannelElements;

  /**
   * @description Creates a new `RSS` feed instance with the provided channel
   * metadata.
   *
   * @param { ChannelElements } channelElements - The mmetadata describing the
   *   RSS channel. This must include the required properties defined in
   *   {@link ChannelElements}, such as `title`, `link` and `description`. The
   *   optional fields may also be provided to supply extended metadata.
   */
  public constructor(channelElements: ChannelElements) {
    this.channelElements = channelElements;
  }

  /**
   * @description Appends all `<channel>`-level metadata elements to the XML
   * document.
   *
   * This method serializes both required and optional RSS channel fields stored
   * in `channelElements`. Required properties (`title`, `link` and
   * `description`) are always included while optional fields are only added if
   * they contain a value preventing empty or placeholder tags from rendering in
   * the XML output.
   *
   * Date-based fields (`pubDate` and `lastBuildDate`) are formatted to the RFC
   * 1123 standard using {@link formatDate} before serialization as required by
   * the RSS 2.0 specification.
   *
   * Additionally, the optional metadata such as language, editor information,
   * generator metadata, category details and fetch/skip directives are included
   * when present. More complex fields (e.g., `image`, `textInput`, etc)
   * currently require further logic and will be extended in future updates.
   *
   * @param { XMLBuilder } document - The XML node representing the `<channel>`
   *   element to which metadata elements shoulld be appended.
   */
  // oxlint-disable-next-line eslint/max-statements eslint/max-lines-per-function
  private addChannelEl(document: XMLBuilder): void {
    // Required elements (title, link and description)
    // The title of the channel
    buildNode(document, "title", this.channelElements.title);

    // The link to the RSS feed
    buildNode(document, "link", this.channelElements.link);

    // The description of the RSS feed itself
    buildNode(document, "description", this.channelElements.description);

    // Optional elements which are added if they were configured
    // The supported language of the feed (e.g., `"en-US"`, `"en-IN"`)
    buildNode(document, "language", this.channelElements.language);

    // The copyright notice for the document
    buildNode(document, "copyright", this.channelElements.copyright);

    // The editorial manager of the feed
    buildNode(document, "managingEditor", this.channelElements.managingEditor);

    // The technical manager of the feed
    buildNode(document, "webMaster", this.channelElements.webMaster);

    // The publication date of the feed (usually defaults to the last published
    // Item)
    buildNode(document, "pubDate", formatDate(this.channelElements.pubDate));

    // The date when the feed was last generated
    buildNode(
      document,
      "lastBuildDate",
      formatDate(this.channelElements.lastBuildDate),
    );

    // The category or tag of the feed
    buildNode(document, "category", this.channelElements.category);

    // The software used to generate the feed (e.g., "Rivu (Node.js)")
    buildNode(document, "generator", this.channelElements.generator);

    // The documentation (or rather the spec sheet) of RSS 2.0
    buildNode(document, "docs", this.channelElements.docs);

    // The time to live before the feed refreshes
    buildNode(document, "ttl", this.channelElements.ttl);

    // TODO: The following elements require some more logic to be handled. Also
    // The `textInput` field is missing and needs to be added here
    buildNode(document, "image", this.channelElements.image);
    buildNode(document, "skipHours", this.channelElements.skipHours);
    buildNode(document, "skipDays", this.channelElements.skipDays);
  }

  /**
   * @description Serializes all `<item>` elements within the RSS feed and
   * appends them to the `<channel>` element.
   *
   * If the feed doees not define any items or if `items` is not an array, this
   * method performs no action. Each item in the list is mapped to its own
   * `<item>` element under the `<channel>` node.
   *
   * @param { XMLBuilder } channel - The `<channel>` XML node into which
   *   `<item>` elements should be inserted.
   */
  // oxlint-disable-next-line eslint/max-statements
  private addItems(channel: XMLBuilder): void {
    // Stop execution if no items were passed
    if (!Array.isArray(this.channelElements.items)) {
      return;
    }

    for (const item of this.channelElements.items) {
      // Add the `<item>` node to a parent `<channel>` node
      const itemEl = channel.ele("item");

      // Build the children for the `<item>` node
      buildNode(itemEl, "title", item.title);
      buildNode(itemEl, "link", item.link);
      buildNode(itemEl, "description", item.description);
      buildNode(itemEl, "author", item.author);
      buildNode(itemEl, "category", item.category);
      buildNode(itemEl, "comments", item.comments);
      buildNode(itemEl, "guid", item.guid);
      buildNode(itemEl, "pubDate", formatDate(item.pubDate));
    }
  }

  /**
   * @description Generates an RSS 2.0 compliant XML string representation of
   * the feed.
   *
   * This method constructs the `<rss>` and `<channel>` elements and then
   * populates them using the metadata stored in {@link channelElements}. All
   * required channel fields (`title`, `link` and `description`) are always
   * included in the output. Optional fields are only included if values have
   * been provided by the consumer of this class.
   *
   * Internally, the helper function `add()` is used to conditionally add XML
   * elements and avoid repetitive null/undefined checks. Undefined or null
   * values are silently skipped, ensuring a clean and standards-compliant RSS
   * output with no empty tags.
   *
   * @example
   *   ```ts
   *   const feed = new Feed({
   *     title: "My Blog",
   *     link: "https://example.com",
   *     description: "Latest updates",
   *   });
   *
   *   const xml = feed.generate();
   *   console.log(xml);
   *   ```;
   *
   * @returns { string } A formatted RSS feed XML string.
   */
  public generate(): string {
    // The XML document along with the root node (named `<rss>`)
    const document = create({ version: "1.0" })
      .ele("rss", { version: "2.0" })
      .att("xmlns:atom", "http://www.w3.org/2005/Atom");

    // The `<channel>` node which consists of various metadata and item child
    // Elements
    const channel = document.ele("channel").ele("atom:link", {
      href: `${this.channelElements.link}`,
      rel: "self",
      type: "application/rss+xml",
    });

    // Build the `<channel>` and its child `<item>` nodes
    this.addChannelEl(channel);
    this.addItems(channel);

    // Render the XML document tree with nicely indented lines (where necessary)
    return document.end({ prettyPrint: true });
  }
}
