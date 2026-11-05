import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";

vi.setConfig({ testTimeout: 10_000 });

describe("date fields", () => {
  it("omits date fields when not valid Date instance", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "undefined dates",
      items: [],
      lastBuildDate: undefined,
      link: "https://example.com",
      pubDate: undefined,
      title: "Invalid dates",
    });
    const xml = feed.generate();

    expect(xml).not.toContain("<pubDate>");
    expect(xml).not.toContain("<lastBuildDate>");
  });
});

describe("formatting", () => {
  it("produces pretty printed XML", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Test pretty",
      items: [],
      link: "https://example.com",
      title: "Pretty",
    });
    const xml = feed.generate();

    expect(xml).toMatch(/\n\s*<channel>/u);
  });
});

describe("stylesheet", () => {
  it("quotes the stylesheet href", () => {
    expect.hasAssertions();

    const feed = new Feed(
      {
        description: "Test stylesheet",
        items: [],
        link: "https://example.com",
        title: "Stylesheet",
      },
      { stylesheet: new URL("https://example.com/rss.xsl") },
    );
    const xml = feed.generate();

    expect(xml).toContain(
      '<?xml-stylesheet type="text/xsl" href="https://example.com/rss.xsl"?>',
    );
  });

  it("types a .css stylesheet as text/css", () => {
    expect.hasAssertions();

    const feed = new Feed(
      {
        description: "Test stylesheet",
        items: [],
        link: "https://example.com",
        title: "Stylesheet",
      },
      { stylesheet: new URL("https://example.com/rss.CSS?v=2") },
    );
    const xml = feed.generate();

    expect(xml).toContain(
      '<?xml-stylesheet type="text/css" href="https://example.com/rss.CSS?v=2"?>',
    );
  });
});

describe("atom self link", () => {
  it("points the self link at the feed URL, not the channel link", () => {
    expect.hasAssertions();

    const feed = new Feed(
      {
        description: "Self link",
        items: [],
        link: "https://example.com",
        title: "Self link",
      },
      { feedURL: "https://example.com/rss.xml" },
    );
    const xml = feed.generate();

    expect(xml).toContain(
      '<atom:link href="https://example.com/rss.xml" rel="self" type="application/rss+xml"/>',
    );
    expect(xml).toContain("<link>https://example.com</link>");
  });

  it("accepts a URL instance as the feed URL", () => {
    expect.hasAssertions();

    const feed = new Feed(
      {
        description: "Self link",
        items: [],
        link: "https://example.com",
        title: "Self link",
      },
      { feedURL: new URL("https://example.com/rss.xml") },
    );

    expect(feed.generate()).toContain(
      'href="https://example.com/rss.xml" rel="self"',
    );
  });
});

describe("feed options", () => {
  it("combines the feed URL with a stylesheet", () => {
    expect.hasAssertions();

    const xml = new Feed(
      {
        description: "Both options",
        items: [],
        link: "https://example.com",
        title: "Both options",
      },
      {
        feedURL: "https://example.com/rss.xml",
        stylesheet: new URL("https://example.com/rss.xsl"),
      },
    ).generate();

    expect(xml).toContain('href="https://example.com/rss.xsl"?>');
    expect(xml).toContain('href="https://example.com/rss.xml" rel="self"');
  });

  it("omits the self link when no feed URL is given", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "No self link",
      items: [],
      link: "https://example.com",
      title: "No self link",
    });

    expect(feed.generate()).not.toContain("<atom:link");
  });
});

describe("category", () => {
  it("emits one channel category element per entry", () => {
    expect.hasAssertions();

    const xml = new Feed({
      category: ["Engineering", "Open Source"],
      description: "Categories",
      items: [],
      link: "https://example.com",
      title: "Categories",
    }).generate();

    expect(xml).toContain("<category>Engineering</category>");
    expect(xml).toContain("<category>Open Source</category>");
  });

  it("emits one item category element per entry", () => {
    expect.hasAssertions();

    const xml = new Feed({
      description: "Categories",
      items: [{ category: ["Nuxt", "RSS"], title: "Post" }],
      link: "https://example.com",
      title: "Categories",
    }).generate();

    expect(xml).toContain("<category>Nuxt</category>");
    expect(xml).toContain("<category>RSS</category>");
  });

  it("still accepts a single category string", () => {
    expect.hasAssertions();

    const xml = new Feed({
      category: "Engineering",
      description: "Categories",
      items: [],
      link: "https://example.com",
      title: "Categories",
    }).generate();

    expect(xml.match(/<category>/gu)).toStrictEqual(["<category>"]);
  });
});
