/**
 * @description Represents the days of the week used in RSS `<skipDays>` metadata. If a feed
 * specifies `skipDays`, aggregators may choose not to fetch the feed on the
 * listed days of the week.
 *
 * @see https://www.rssboard.org/rss-specification#skipDays
 */
type Days =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

/**
 * @description Represents the hours of the day (0-23) based on a 24-hour clock used in the
 * RSS `<skipHours>` metadata. If a feed specifies `skipHours`, aggregators may
 * choose not to fetch the feed during the specified hours. This is primarily
 * helpful for rate-limiting or predictable downtime periods.
 *
 * @see https://www.rssboard.org/rss-specification#skipHours
 */
type Hour =
  // oxlint-disable eslint/no-magic-numbers
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

/**
 * @description Represents the `<textInput>` element in a RSS feed. This is used to define a
 * form interface that allows users to submit feedback or search queries from
 * RSS readers that support that feature.
 */
interface TextInput {
  /** @description The label of the submit button. */
  title: string;

  /** @description A description of the text input's purpose. */
  description: string;

  /** @description The name attribute for the input element. */
  name: string;

  /** @description The URL where the text input form is submitted. */
  link: URL;
}

/**
 * @description Represents a single `<item>` element in a RSS feed. Each item typically
 * corresponds to a piece of published content, such as a blog post, article,
 * podcast episode or update. All the fields are optional but the implementation
 * should at least contain either a title or a description.
 */
interface ItemElements {
  /** @description The title of the item, usually the name of the article or a post. */
  title?: string | null;

  /** @description The canonical URL where the full content of the item can be accessed. */
  link?: string | URL | null;

  /** @description A short summary or description of the item. */
  description?: string | null;

  /**
   * @description The author of the item, typically formatted as `email (Name)` but the
   * formats can vary.
   */
  author?: string | null;

  /** @description A category or tag describing the topic of the item. */
  category?: string | null;

  /** @description A link to the comments page or discussion thread related to the item. */
  comments?: string | URL | null;

  // Enclosure?: string

  /**
   * @description A string that uniquely identifies the item. Typically the canonical URL of
   * the item, but any opaque identifier is allowed by the RSS 2.0
   * specification.
   *
   * @see https://www.rssboard.org/rss-specification#ltguidgtSubelementOfLtitemgt
   */
  guid?: string | null;

  /** @description The publication date for the item. */
  pubDate?: Date | null;

  // Source?: string | URL
}

/**
 * @description Represents the metadata that defines an RSS `<channel>`. This includes
 * required core information (title, link, description), optional publishing
 * metadata and extended metadata such as skip rules and text input
 * information.
 */
interface ChannelElements {
  /** @description The name of the feed, often the site name or the publication title. */
  title: string;

  /** @description The canonical URL corresponding to the feed's website. */
  link: string;

  /** @description A short explanation of the feed's purpose. */
  description: string;

  /**
   * @description The language of the content, specified as an IETF language tag (e.g.,
   * `en-US`).
   */
  language?: string | null;

  /** @description Copyright notice for the content. */
  copyright?: string | null;

  /** @description Email address of the person responsible for the editorial content. */
  managingEditor?: string | null;

  /** @description Email address of the technical contact responsible for feed maintenance. */
  webMaster?: string | null;

  /** @description The publication date of the feed's content. */
  pubDate?: Date | null;

  /** @description The last time the feed content was modified. */
  lastBuildDate?: Date | null;

  /** @description A category or classification of the feed. */
  category?: string | null;

  /** @description The software used to generated the feed. */
  generator?: string | null;

  /** @description The official URL of the RSS specification, usually left unchanged. */
  docs?: "https://www.rssboard.org/rss-specification" | null;

  // TODO: Implement this metadata, refer to docs before doing so.
  // Cloud?: any

  /** @description The number of minutes a feed can be cached before refreshing it. */
  ttl?: number | null;

  /**
   * @description An image representing the channel (a URL to an image or an actual `URL`
   * object).
   */
  image?: URL | string | null;

  // TODO: Implement this metadata, refer to the docs before doing so.
  // Rating?: any

  /** @description Defines an embedded text input interface inside RSS-capable clients. */
  textInput?: TextInput | null;

  /**
   * @description Hours during which aggregators should refrain from fetching the feed. It
   * can be useful for managing predictable server load windows or maintenance
   * periods.
   */
  skipHours?: Hour | null;

  /**
   * @description Days of the week during which aggregators should avoid retreiving the feed.
   * It helps publishers avoid unnecessary fetches during predictable no-update
   * days.
   */
  skipDays?: Days | null;

  /**
   * @description The collection of published entries associated with the channel. Each entry
   * is represented by an `<item>` element describing an article, update or
   * meaningful piece of content.
   */
  items: ItemElements[];
}

/**
 * @description Represents the structure and data required for constructing an RSS feed. This
 * interface defines the core contract for any RSS feed implementation. It
 * stores the `<channel>` level metadata used when generating an RSS `<channel>`
 * element which also includes information such as the title, link, description
 * and optional publishing metadata. Implementations of this interface are
 * expected to use `channelElements` as the source of truth for feed
 * configuration and output formatting.
 *
 * @see https://www.rssboard.org/rss-specification#requiredChannelElements
 */
interface RSS {
  /**
   * @description Generates the RSS feed as a serialised XML string.
   *
   * @returns A serialised RSS 2.0 XML document as a UTF-8 string.
   */
  generate: () => string;
}

export type { Days, Hour, ItemElements, ChannelElements, RSS };
