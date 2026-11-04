import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";

import {
  appendAuthor,
  appendCategory,
  appendElement,
  appendLink,
  appendText,
} from "./atom-constructs.ts";
import type { ChannelElements, ItemElements } from "./types.ts";
import { isValidDate } from "./utils.ts";

/**
 * @description The entry-level values which are resolved from the feed rather
 * than the item itself.
 */
interface AtomEntryDefaults {
  /** @description The unique identifier of the entry. */
  id: string;

  /** @description The date to use when the item has no publication date. */
  updated: Date;
}

/** @description The XML namespace every Atom 1.0 document must declare. */
const ATOM_NAMESPACE = "http://www.w3.org/2005/Atom";

/**
 * @description Determines the value of the feed-level `<updated>` element.
 *
 * Atom requires every feed to declare when it was last updated. The value falls
 * back from `lastBuildDate` to `pubDate`, then to the most recent item
 * `pubDate` and finally to the current time.
 *
 * @param { ChannelElements } channel - The channel metadata of the feed.
 * @param { ItemElements[] } items - The items of the feed.
 *
 * @returns { Date } The date to use for the feed's `<updated>` element.
 */
const resolveFeedUpdated = (
  channel: ChannelElements,
  items: ItemElements[],
): Date => {
  if (isValidDate(channel.lastBuildDate)) {
    return channel.lastBuildDate;
  }

  if (isValidDate(channel.pubDate)) {
    return channel.pubDate;
  }

  const latest = Math.max(
    ...items
      .map((item) => item.pubDate)
      .filter((date) => isValidDate(date))
      .map((date) => date.getTime()),
  );

  return Number.isFinite(latest) ? new Date(latest) : new Date();
};

/**
 * @description Determines the value of an entry's `<id>` element.
 *
 * Atom requires every entry to carry a permanent, unique identifier. The item's
 * `guid` is preferred, followed by its `link`. Items with neither fall back to
 * an identifier derived from the channel link and the item's position, which is
 * NOT stable across reordering, so consumers should provide a `guid` or `link`
 * for every item.
 *
 * @param { ItemElements } item - The item to identify.
 * @param { string } channelLink - The link of the parent channel.
 * @param { number } index - The zero-based position of the item in the feed.
 *
 * @returns { string } The identifier to use for the entry.
 */
const resolveEntryId = (
  item: ItemElements,
  channelLink: string,
  index: number,
): string => {
  if (item.guid) {
    return item.guid;
  }

  if (item.link) {
    return String(item.link);
  }

  return `${channelLink}#entry-${index}`;
};

/**
 * @description Appends the `<updated>` and `<published>` elements of an entry.
 *
 * @param { XMLBuilder } entry - The `<entry>` element to append the dates to.
 * @param { Date } [pubDate] - The publication date of the item, if any.
 * @param { Date } fallback - The `<updated>` value when `pubDate` is not set.
 */
const appendEntryDates = (
  entry: XMLBuilder,
  pubDate: Date | undefined,
  fallback: Date,
): void => {
  const published = isValidDate(pubDate) ? pubDate.toISOString() : undefined;

  appendElement(entry, "updated", published ?? fallback.toISOString());
  appendElement(entry, "published", published);
};

/**
 * @description Serializes a single item as an Atom `<entry>` element.
 *
 * @param { XMLBuilder } feed - The `<feed>` element to append the entry to.
 * @param { ItemElements } item - The item to serialize.
 * @param { AtomEntryDefaults } defaults - The resolved `<id>` of the entry and
 *   the `<updated>` value to use when the item has no publication date.
 */
const appendEntry = (
  feed: XMLBuilder,
  item: ItemElements,
  defaults: AtomEntryDefaults,
): void => {
  const entry = feed.ele("entry");

  appendElement(entry, "id", defaults.id);
  appendText(entry, "title", item.title ?? "");
  appendEntryDates(entry, item.pubDate, defaults.updated);
  appendLink(entry, item.link, "alternate");
  appendLink(entry, item.comments, "replies");
  appendAuthor(entry, item.author);
  appendCategory(entry, item.category);
  appendText(entry, "summary", item.description);
};

/**
 * @description Appends the feed-level metadata elements to the `<feed>`.
 *
 * @param { XMLBuilder } feed - The `<feed>` element to append to.
 * @param { ChannelElements } channel - The channel metadata of the feed.
 * @param { Date } updated - The resolved `<updated>` value of the feed.
 */
const appendFeedMetadata = (
  feed: XMLBuilder,
  channel: ChannelElements,
  updated: Date,
): void => {
  appendElement(feed, "id", channel.link);
  appendText(feed, "title", channel.title);
  appendText(feed, "subtitle", channel.description);
  appendElement(feed, "updated", updated.toISOString());
  appendLink(feed, channel.link, "alternate");
  appendAuthor(feed, channel.managingEditor ?? channel.title);
  appendCategory(feed, channel.category);
  appendElement(feed, "generator", channel.generator);
  appendElement(feed, "logo", channel.image);
  appendText(feed, "rights", channel.copyright);
};

/**
 * @description Builds an Atom 1.0 `<feed>` from RSS channel metadata.
 *
 * The same {@link ChannelElements} used for RSS output are mapped to their
 * closest Atom equivalents:
 *
 * - `link` becomes the feed `<id>` and its `rel="alternate"` link.
 * - `description` becomes `<subtitle>`, `copyright` becomes `<rights>` and
 *   `image` becomes `<logo>`.
 * - `language` is set as the `xml:lang` attribute of the `<feed>` element.
 * - `managingEditor` becomes the feed `<author>`, falling back to the feed
 *   `title` since Atom requires every feed to have an author.
 * - Items become `<entry>` elements, with `guid` (or `link`) as the `<id>`,
 *   `description` as `<summary>` and `comments` as a `rel="replies"` link.
 *
 * Fields without an Atom equivalent (`webMaster`, `docs`, `ttl`, `textInput`,
 * `skipHours` and `skipDays`) are omitted.
 *
 * @param { XMLBuilder } document - The XML document to append the `<feed>`
 *   element to.
 * @param { ChannelElements } channel - The channel metadata of the feed.
 * @see https://www.rfc-editor.org/rfc/rfc4287
 */
const buildAtomFeed = (
  document: XMLBuilder,
  channel: ChannelElements,
): void => {
  const items = Array.isArray(channel.items) ? channel.items : [];
  const updated = resolveFeedUpdated(channel, items);
  const feed = document.ele(ATOM_NAMESPACE, "feed");

  if (channel.language) {
    feed.att("xml:lang", channel.language);
  }

  appendFeedMetadata(feed, channel, updated);

  for (const [index, item] of items.entries()) {
    appendEntry(feed, item, {
      id: resolveEntryId(item, channel.link, index),
      updated,
    });
  }
};

export default buildAtomFeed;
