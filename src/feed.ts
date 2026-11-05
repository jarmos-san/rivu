import { create } from "xmlbuilder2";
import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";

import type {
  BuildNodeOption,
  ChannelElements,
  RSS,
  StyleSheet,
} from "./types.ts";
import {
  handleGUIDAttribute,
  appendContent,
  formatDate,
  getStylesheetType,
} from "./utils.ts";

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
 * Additionally, if the element is a `guid`, an `isPermaLink` attribute is
 * automatically added indicating whether the value is a valid URL.
 *
 * @param { BuildNodeOptions } options - The options object containing
 *   parameters for the node.
 */
function buildNode(options: BuildNodeOption): void {
  if (options.value === undefined || options.value === null) {
    return;
  }

  const stringValue = String(options.value);
  const element = options.doc.ele(options.name);

  handleGUIDAttribute(element, options.name, stringValue);
  appendContent(element, stringValue, options.cdata);
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
   * @description An optional stylesheet URL to be injected as an XML processing
   * instruction at the document root.
   */
  private readonly stylesheet?: StyleSheet;

  /**
   * @description Creates a new `RSS` feed instance with the provided channel
   * metadata.
   *
   * @param { ChannelElements } channelElements - The mmetadata describing the
   *   RSS channel. This must include the required properties defined in
   *   {@link ChannelElements}, such as `title`, `link` and `description`. The
   *   optional fields may also be provided to supply extended metadata.
   * @param { URL } stylesheet - Optional URL to an XSL/CSS stylesheet.
   */
  public constructor(
    channelElements: ChannelElements,
    stylesheet?: StyleSheet,
  ) {
    this.channelElements = channelElements;

    if (stylesheet) {
      this.stylesheet = stylesheet;
    }
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
  private addChannelEl(document: XMLBuilder): void {
    const nodes: Omit<BuildNodeOption, "doc">[] = [
      // NOTE: The sequence of the arrangement is IMPORTANT!
      { cdata: true, name: "title", value: this.channelElements.title },
      { name: "link", value: this.channelElements.link },
      {
        cdata: true,
        name: "description",
        value: this.channelElements.description,
      },
      { name: "language", value: this.channelElements.language },
      { name: "copyright", value: this.channelElements.copyright },
      { name: "managingEditor", value: this.channelElements.managingEditor },
      { name: "webMaster", value: this.channelElements.webMaster },
      { name: "pubDate", value: formatDate(this.channelElements.pubDate) },
      {
        name: "lastBuildDate",
        value: formatDate(this.channelElements.lastBuildDate),
      },
      { name: "category", value: this.channelElements.category },
      { name: "generator", value: this.channelElements.generator },
      { name: "docs", value: this.channelElements.docs },
      { name: "ttl", value: this.channelElements.ttl },
      { name: "image", value: this.channelElements.image },
      { name: "skipHours", value: this.channelElements.skipHours },
      { name: "skipDays", value: this.channelElements.skipDays },
    ];

    for (const node of nodes) {
      buildNode({
        cdata: node.cdata ?? false,
        doc: document,
        name: node.name,
        value: node.value,
      });
    }
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
  private addItems(channel: XMLBuilder): void {
    // Stop execution if no items were passed
    if (!Array.isArray(this.channelElements.items)) {
      return;
    }

    for (const item of this.channelElements.items) {
      // Add the `<item>` node to a parent `<channel>` node
      const itemEl = channel.ele("item");
      const itemNodes: Omit<BuildNodeOption, "doc">[] = [
        { cdata: true, name: "title", value: item.title },
        { name: "link", value: item.link },
        { cdata: true, name: "description", value: item.description },
        { name: "author", value: item.author },
        { name: "category", value: item.category },
        { name: "comments", value: item.comments },
        { name: "guid", value: item.guid },
        { name: "pubDate", value: formatDate(item.pubDate) },
      ];

      for (const node of itemNodes) {
        buildNode({
          cdata: node.cdata ?? false,
          doc: itemEl,
          name: node.name,
          value: node.value,
        });
      }
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
    // Construct the XML DOM tree
    const document = create({ version: "1.0" });

    // Conditionally insert stylesheet processing instructions if provided.
    if (this.stylesheet) {
      document.ins(
        "xml-stylesheet",
        `type="${getStylesheetType(this.stylesheet)}" href="${this.stylesheet}"`,
      );
    }

    // The XML document along with the root node named `<rss>`.
    const rss = document
      .ele("rss", { version: "2.0" })
      .att("xmlns:atom", "http://www.w3.org/2005/Atom");

    // Construct the `<channel>` node in the tree.
    const channel = rss.ele("channel");
    channel
      .ele("atom:link", {
        href: `${this.channelElements.link}`,
        rel: "self",
        type: "application/rss+xml",
      })
      .up();

    // Build the `<channel>` and its child `<item>` nodes
    this.addChannelEl(channel);
    this.addItems(channel);

    // Render the XML document tree with nicely indented lines (where necessary)
    return document.end({ prettyPrint: true });
  }
}
