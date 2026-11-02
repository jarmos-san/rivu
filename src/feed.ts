import { create } from "xmlbuilder2";
import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";

import type { BuildNodeOptions, ChannelElements, RSS } from "./types.ts";

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
 * This helper method avoids repetitive null and undefined checks when
 * serializing channel or item fields. If the supplied `value` is defined, a new
 * XML element named `name` is created under `doc`.
 *
 * By default, text content is safely escaped using `.txt()`. If `cdata` is set
 * to `true` (or if HTML tags/markup are automatically detected in the value),
 * the content is wrapped in a CDATA section (`<![CDATA[...]]>`) via `.dat()`.
 * If `value` is `undefined` or `null`, the method performs no action, ensuring
 * RSS fields are omitted entirely from the final output rather than appearing
 * as empty tags.
 *
 * @param { BuildNodeOptions } options - The options object containing
 *   parameters for the node.
 */
function buildNode(options: BuildNodeOptions): void {
  if (options.value === undefined || options.value === null) {
    return;
  }

  const stringValue = String(options.value);

  const shouldUseCdata = options.cdata || /<[a-z][\s\S]*>/iu.test(stringValue);

  const element = options.doc.ele(options.name);

  if (shouldUseCdata) {
    element.dat(stringValue);
  } else {
    element.txt(stringValue);
  }

  element.up();
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
    buildNode({
      cdata: true,
      doc: document,
      name: "title",
      value: this.channelElements.title,
    });

    // The link to the RSS feed
    buildNode({
      doc: document,
      name: "link",
      value: this.channelElements.link,
    });

    // The description of the RSS feed itself
    buildNode({
      cdata: true,
      doc: document,
      name: "description",
      value: this.channelElements.description,
    });

    // Optional elements which are added if they were configured
    // The supported language of the feed (e.g., `"en-US"`, `"en-IN"`)
    buildNode({
      doc: document,
      name: "language",
      value: this.channelElements.language,
    });

    // The copyright notice for the document
    buildNode({
      doc: document,
      name: "copyright",
      value: this.channelElements.copyright,
    });

    // The editorial manager of the feed
    buildNode({
      doc: document,
      name: "managingEditor",
      value: this.channelElements.managingEditor,
    });

    // The technical manager of the feed
    buildNode({
      doc: document,
      name: "webMaster",
      value: this.channelElements.webMaster,
    });

    // The publication date of the feed (usually defaults to the last published
    // Item)
    buildNode({
      doc: document,
      name: "pubDate",
      value: formatDate(this.channelElements.pubDate),
    });

    // The date when the feed was last generated
    buildNode({
      doc: document,
      name: "lastBuildDate",
      value: formatDate(this.channelElements.lastBuildDate),
    });

    // The category or tag of the feed
    buildNode({
      doc: document,
      name: "category",
      value: this.channelElements.category,
    });

    // The software used to generate the feed (e.g., "Rivu (Node.js)")
    buildNode({
      doc: document,
      name: "generator",
      value: this.channelElements.generator,
    });

    // The documentation (or rather the spec sheet) of RSS 2.0
    buildNode({
      doc: document,
      name: "docs",
      value: this.channelElements.docs,
    });

    // The time to live before the feed refreshes
    buildNode({
      doc: document,
      name: "ttl",
      value: this.channelElements.ttl,
    });

    // TODO: The following elements require some more logic to be handled. Also
    // The `textInput` field is missing and needs to be added here
    buildNode({
      doc: document,
      name: "image",
      value: this.channelElements.image,
    });

    buildNode({
      doc: document,
      name: "skipHours",
      value: this.channelElements.skipHours,
    });

    buildNode({
      doc: document,
      name: "skipDays",
      value: this.channelElements.skipDays,
    });
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
  // oxlint-disable-next-line eslint/max-statements eslint/max-lines-per-function
  private addItems(channel: XMLBuilder): void {
    // Stop execution if no items were passed
    if (!Array.isArray(this.channelElements.items)) {
      return;
    }

    for (const item of this.channelElements.items) {
      // Add the `<item>` node to a parent `<channel>` node
      const itemEl = channel.ele("item");

      // The title of the item.
      buildNode({
        cdata: true,
        doc: itemEl,
        name: "title",
        value: item.title,
      });

      // The canonical link to the item's content.
      buildNode({
        doc: itemEl,
        name: "link",
        value: item.link,
      });

      // The description of the item's description.
      buildNode({
        cdata: true,
        doc: itemEl,
        name: "description",
        value: item.description,
      });

      // The author of the item's content.
      buildNode({
        doc: itemEl,
        name: "author",
        value: item.author,
      });

      // The category of the item's content.
      buildNode({
        doc: itemEl,
        name: "category",
        value: item.category,
      });

      // The comments on the item's content.
      buildNode({
        doc: itemEl,
        name: "comments",
        value: item.comments,
      });

      // The globally unique identifer of the item's content.
      buildNode({
        doc: itemEl,
        name: "guid",
        value: item.guid,
      });

      // The publication date of the item's content.
      buildNode({
        doc: itemEl,
        name: "pubDate",
        value: formatDate(item.pubDate),
      });
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
