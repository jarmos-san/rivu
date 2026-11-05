import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";

vi.setConfig({ testTimeout: 10_000 });

describe("atom self link", () => {
  it("points the self link at the feed URL, not the channel link", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Self link",
      feedUrl: "https://example.com/rss.xml",
      items: [],
      link: "https://example.com",
      title: "Self link",
    });
    const xml = feed.generate();

    expect(xml).toContain(
      '<atom:link href="https://example.com/rss.xml" rel="self" type="application/rss+xml"/>',
    );
    expect(xml).toContain("<link>https://example.com</link>");
  });

  it("accepts a URL instance as the feed URL", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Self link",
      feedUrl: new URL("https://example.com/rss.xml"),
      items: [],
      link: "https://example.com",
      title: "Self link",
    });

    expect(feed.generate()).toContain(
      'href="https://example.com/rss.xml" rel="self"',
    );
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
