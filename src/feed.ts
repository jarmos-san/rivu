import type { ChannelElements, RSS } from "./types.ts";
import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";
import { create } from "xmlbuilder2";

/**
 * Represents an RSS feed generator instance.
 *
 * The `RSS` class stores channel-level metadata which describes the feed,
 * including required fields such as `title`, `link` and `description`, as well
 * as optional metadata like publication dates, editor information and
 * fetch/skip rules.
 */
export class Feed implements RSS {
  /**
   * The RSS `<channel>` metadata used to describe the feed.
   *
   * This value is supplied when constructing the `RSS` instance and is stored
   * without modification. It is expected that validation, normalization or
   * transformation (if necessary) will be handled externally or in future
   * enhancements.
   */
  private readonly channelElements: ChannelElements;

  /**
   * Creates a new `RSS` feed instance with the provided channel metadata.
   *
   * @param channelElements - The mmetadata describing the RSS channel. This
   * must include the required properties defined in {@link ChannelElements},
   * such as `title`, `link` and `description`. The optional fields may also be
   * provided to supply extended metadata.
   */
  constructor(channelElements: ChannelElements) {
    this.channelElements = channelElements;
  }

  /**
   * Converts a JavaScript `Date` object into a valid RSS-approved date string.
   *
   * RSS 2.0 requires the date values to be formatted using the RFC 1123 format
   * which is achieved via the `Date.prototype.toUTCString()` method. If the
   * provided value is `undefined` or `null` or is not a `Date` instance, no
   * output is returned to ensure the optional date fields are ommited in the
   * rendered XML output.
   *
   * @param date - The date value format. Maybe a `Date` object, `null` or
   * `undefined`.
   *
   * @returns A UTC-formatted date string if `date` is a valid `Date` instance,
   * otherwise it is undefined allowing the caller to skip serialization.
   */
  private formatDate(date?: Date | null): string | undefined {
    return date instanceof Date ? date.toUTCString() : undefined;
  }

  /**
   * Conditionally appends an XML element to the provided builder.
   *
   * This helper method avoids repititive null and undefined checks when
   * serializing channel or item fields. If the supplied `value` is defined, a
   * new XML element named `name` is created under `doc` and its text content
   * is set to the string representation of `value`. If the `value` is
   * `undefined` or `null`, the method performs no action, ensuring that RSS
   * fields are omitted entirely from the final output rather than appearing as
   * empty tags.
   *
   * @param doc - The current XML builder node to append the new element to.
   * @param name - The XML element name. Used for both `<channel>`-level
   * metadata and `<item>`-level subelements, so it is not constrained to a
   * specific key set.
   * @param value - The value to serialize into the the element text content.
   * If `undefined` or `null`, no element will be created.
   */
  private build(doc: XMLBuilder, name: string, value: unknown): void {
    if (value === undefined || value === null) return;
    doc.ele(name).dat(String(value)).up();
  }

  /**
   * Appends all `<channel>`-level metadata elements to the XML document.
   *
   * This method serializes both required and optional RSS channel fields
   * stored in `channelElements`. Required properties (`title`, `link` and
   * `description`) are always included while optional fields are only added if
   * they contain a value preventing empty or placeholder tags from rendering
   * in the XML output.
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
   * @param document - The XML node representing the `<channel>` element to
   * which metadata elements shoulld be appended.
   */
  private addChannelEl(document: XMLBuilder): void {
    // Required elements (title, link and description)
    // The title of the channel
    this.build(document, "title", this.channelElements.title);

    // The link to the RSS feed
    this.build(document, "link", this.channelElements.link);

    // The description of the RSS feed itself
    this.build(document, "description", this.channelElements.description);

    // Optional elements which are added if they were configured
    // The supported language of the feed (e.g., `"en-US"`, `"en-IN"`)
    this.build(document, "language", this.channelElements.language);

    // The copyright notice for the document
    this.build(document, "copyright", this.channelElements.copyright);

    // The editorial manager of the feed
    this.build(document, "managingEditor", this.channelElements.managingEditor);

    // The technical manager of the feed
    this.build(document, "webMaster", this.channelElements.webMaster);

    // The publication date of the feed (usually defaults to the last published
    // item)
    this.build(
      document,
      "pubDate",
      this.formatDate(this.channelElements.pubDate),
    );

    // The date when the feed was last generated
    this.build(
      document,
      "lastBuildDate",
      this.formatDate(this.channelElements.lastBuildDate),
    );

    // The category or tag of the feed
    this.build(document, "category", this.channelElements.category);

    // The software used to generate the feed (e.g., "Rivu (Node.js)")
    this.build(document, "generator", this.channelElements.generator);

    // The documentation (or rather the spec sheet) of RSS 2.0
    this.build(document, "docs", this.channelElements.docs);

    // The time to live before the feed refreshes
    this.build(document, "ttl", this.channelElements.ttl);

    // TODO: The following elements require some more logic to be handled. Also
    // the `textInput` field is missing and needs to be added here
    this.build(document, "image", this.channelElements.image);
    this.build(document, "skipHours", this.channelElements.skipHours);
    this.build(document, "skipDays", this.channelElements.skipDays);
  }

  /**
   * Serializes all `<item>` elements within the RSS feed and appends them to
   * the `<channel>` element.
   *
   * If the feed doees not define any items or if `items` is not an array, this
   * method performs no action. Each item in the list is mapped to its own
   * `<item>` element under the `<channel>` node.
   *
   * @param channel - The `<channel>` XML node into which `<item>` elements
   * should be inserted.
   */
  private addItems(channel: XMLBuilder): void {
    // Stop execution if no items were passed
    if (!Array.isArray(this.channelElements.items)) return;

    for (const item of this.channelElements.items) {
      // Add the `<item>` node to a parent `<channel>` node
      const itemEl = channel.ele("item");

      // Build the children for the `<item>` node
      this.build(itemEl, "title", item.title);
      this.build(itemEl, "link", item.link);
      this.build(itemEl, "description", item.description);
      this.build(itemEl, "author", item.author);
      this.build(itemEl, "category", item.category);
      this.build(itemEl, "comments", item.comments);
      this.build(itemEl, "guid", item.guid);
      this.build(itemEl, "pubDate", this.formatDate(item.pubDate));
    }
  }

  /**
   * Generates an RSS 2.0 compliant XML string representation of the feed.
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
   * @returns A formatted RSS feed XML string.
   *
   * @example
   * ```ts
   * const feed = new Feed({
   *   title: "My Blog",
   *   link: "https://example.com",
   *   description: "Latest updates"
   * });
   *
   * const xml = feed.generate();
   * console.log(xml);
   * ```
   */
  generate(): string {
    // The XML document along with the root node (named `<rss>`)
    const document = create({ version: "1.0" }).ele("rss", { version: "2.0" });

    // The `<channel>` node which consists of various metadata and item child
    // elements
    const channel = document.ele("channel");

    // Build the `<channel>` and its child `<item>` nodes
    this.addChannelEl(channel);
    this.addItems(channel);

    // Render the XML document tree with nicely indented lines (where necessary)
    return document.end({ prettyPrint: true });
  }
}
