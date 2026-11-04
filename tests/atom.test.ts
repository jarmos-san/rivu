import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";
import type { ChannelElements } from "../src/types.ts";

vi.setConfig({ testTimeout: 10_000 });

const ISO_DATE = "2025-10-10T00:00:00.000Z";
const LATER_ISO_DATE = "2025-11-11T00:00:00.000Z";

const BASE_CHANNEL: ChannelElements = {
  description: "Latest updates",
  items: [],
  link: "https://example.com",
  title: "My Blog",
};

/**
 * @description Generates an Atom feed from a minimal valid channel merged with
 * the provided overrides.
 *
 * @param { Partial<ChannelElements> } overrides - The channel fields to set.
 *
 * @returns { string } The generated Atom XML document.
 */
const generateAtom = (overrides: Partial<ChannelElements> = {}): string =>
  new Feed(Object.assign(structuredClone(BASE_CHANNEL), overrides)).generate(
    "atom",
  );

describe("atom feed format selection", () => {
  it("keeps generating RSS 2.0 by default", () => {
    expect.hasAssertions();

    const xml = new Feed(BASE_CHANNEL).generate();

    expect(xml).toContain('<rss version="2.0"');
    expect(xml).not.toContain("<feed");
  });

  it("generates an Atom 1.0 root element", () => {
    expect.hasAssertions();

    const xml = generateAtom();

    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).not.toContain("<rss");
  });

  it("applies the stylesheet processing instruction", () => {
    expect.hasAssertions();

    const xml = new Feed(
      BASE_CHANNEL,
      new URL("https://example.com/feed.xsl"),
    ).generate("atom");

    expect(xml).toContain("<?xml-stylesheet");
    expect(xml).toContain("https://example.com/feed.xsl");
  });
});

describe("atom feed required elements", () => {
  it("maps the required channel fields", () => {
    expect.hasAssertions();

    const xml = generateAtom({ lastBuildDate: new Date(ISO_DATE) });

    expect(xml).toContain("<id>https://example.com</id>");
    expect(xml).toContain("<title>My Blog</title>");
    expect(xml).toContain("<subtitle>Latest updates</subtitle>");
    expect(xml).toContain(`<updated>${ISO_DATE}</updated>`);
    expect(xml).toContain('<link href="https://example.com" rel="alternate"/>');
  });

  it("falls back to the feed title as the author", () => {
    expect.hasAssertions();
    expect(generateAtom()).toMatch(
      /<author>\s*<name>My Blog<\/name>\s*<\/author>/u,
    );
  });

  it("uses the managing editor as the author", () => {
    expect.hasAssertions();

    const xml = generateAtom({
      managingEditor: "jane@example.com (Jane Doe)",
    });

    expect(xml).toContain("<name>Jane Doe</name>");
    expect(xml).toContain("<email>jane@example.com</email>");
  });
});

describe("atom feed optional elements", () => {
  it("maps optional channel metadata to Atom equivalents", () => {
    expect.hasAssertions();

    const xml = generateAtom({
      category: "tech",
      copyright: "Copyright 2025",
      generator: "rivu",
      image: "https://example.com/logo.png",
      language: "en-US",
    });

    expect(xml).toContain('xml:lang="en-US"');
    expect(xml).toContain('<category term="tech"/>');
    expect(xml).toContain("<generator>rivu</generator>");
    expect(xml).toContain("<logo>https://example.com/logo.png</logo>");
    expect(xml).toContain("<rights>Copyright 2025</rights>");
  });

  it("omits RSS-only channel metadata", () => {
    expect.hasAssertions();

    const xml = generateAtom({
      docs: "https://www.rssboard.org/rss-specification",
      skipDays: "Sunday",
      skipHours: 0,
      ttl: 60,
      webMaster: "webmaster@example.com",
    });

    expect(xml).not.toMatch(/ttl|skipDays|skipHours/u);
    expect(xml).not.toContain("webmaster@example.com");
    expect(xml).not.toContain("rssboard");
  });
});

describe("atom text constructs", () => {
  it("marks text containing markup as HTML", () => {
    expect.hasAssertions();
    expect(generateAtom({ title: "My <b>Blog</b>" })).toContain(
      '<title type="html"><![CDATA[My <b>Blog</b>]]>',
    );
  });

  it("escapes plain text content", () => {
    expect.hasAssertions();
    expect(generateAtom({ description: "News & updates" })).toContain(
      "<subtitle>News &amp; updates</subtitle>",
    );
  });
});

describe("atom feed updated date", () => {
  it("falls back to the channel pubDate", () => {
    expect.hasAssertions();
    expect(generateAtom({ pubDate: new Date(ISO_DATE) })).toContain(
      `<updated>${ISO_DATE}</updated>`,
    );
  });

  it("falls back to the most recent valid item pubDate", () => {
    expect.hasAssertions();

    const xml = generateAtom({
      items: [
        { pubDate: new Date(ISO_DATE), title: "Older" },
        { pubDate: new Date(LATER_ISO_DATE), title: "Newer" },
        { pubDate: new Date("not a date"), title: "Invalid" },
      ],
    });

    expect(xml).toMatch(
      new RegExp(`</subtitle>\\s*<updated>${LATER_ISO_DATE}</updated>`, "u"),
    );
  });

  it("falls back to the current time", () => {
    expect.hasAssertions();

    vi.useFakeTimers({ now: new Date(ISO_DATE) });

    const xml = generateAtom();

    vi.useRealTimers();

    expect(xml).toContain(`<updated>${ISO_DATE}</updated>`);
  });
});

describe("atom entry elements", () => {
  const xml = generateAtom({
    items: [
      {
        author: "bob@example.com (Bob)",
        category: "news",
        comments: "https://example.com/post#comments",
        description: "<p>Hello</p>",
        guid: "urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a",
        link: "https://example.com/post",
        pubDate: new Date(ISO_DATE),
        title: "Post",
      },
    ],
  });

  it("serializes the identifying elements of an item", () => {
    expect.hasAssertions();
    expect(xml).toContain("<entry>");
    expect(xml).toContain(
      "<id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>",
    );
    expect(xml).toContain("<title>Post</title>");
    expect(xml).toContain(`<published>${ISO_DATE}</published>`);
  });

  it("serializes the links of an item", () => {
    expect.hasAssertions();
    expect(xml).toContain(
      '<link href="https://example.com/post" rel="alternate"/>',
    );
    expect(xml).toContain(
      '<link href="https://example.com/post#comments" rel="replies"/>',
    );
  });

  it("serializes the metadata of an item", () => {
    expect.hasAssertions();
    expect(xml).toContain("<name>Bob</name>");
    expect(xml).toContain('<category term="news"/>');
    expect(xml).toContain(
      '<summary type="html"><![CDATA[<p>Hello</p>]]></summary>',
    );
  });
});

describe("atom entry fallbacks", () => {
  it("uses the item link as the entry id when no guid is set", () => {
    expect.hasAssertions();
    expect(
      generateAtom({
        items: [{ link: new URL("https://example.com/post"), title: "Post" }],
      }),
    ).toContain("<id>https://example.com/post</id>");
  });

  it("derives an entry id from the channel link as a last resort", () => {
    expect.hasAssertions();

    const xml = generateAtom({
      items: [{ title: "First" }, { title: "Second" }],
    });

    expect(xml).toContain("<id>https://example.com#entry-0</id>");
    expect(xml).toContain("<id>https://example.com#entry-1</id>");
  });

  it("uses the feed updated date and an empty title when missing", () => {
    expect.hasAssertions();

    const xml = generateAtom({
      items: [{ description: "Untitled" }],
      lastBuildDate: new Date(ISO_DATE),
    });
    const entry = xml.slice(xml.indexOf("<entry>"));

    expect(entry).toContain("<title/>");
    expect(entry).toContain(`<updated>${ISO_DATE}</updated>`);
    expect(entry).not.toContain("<published>");
  });
});

describe("atom feed without items", () => {
  it("omits entries when items is not an array", () => {
    expect.hasAssertions();

    const xml = generateAtom({
      items: undefined as unknown as ChannelElements["items"],
    });

    expect(xml).toContain("<feed");
    expect(xml).not.toContain("<entry>");
  });
});
