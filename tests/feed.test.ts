import { URL } from "node:url";

import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";

vi.setConfig({ testTimeout: 10_000 });

describe("channel required metadata", () => {
  it("generates required fields wrapped in CDATA", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Latest updates",
      items: [],
      link: "https://example.com",
      title: "My Blog",
    });
    const xml = feed.generate();

    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");
    expect(xml).toContain("<title><![CDATA[My Blog]]></title>");
    expect(xml).toContain("<link><![CDATA[https://example.com]]></link>");
    expect(xml).toContain(
      "<description><![CDATA[Latest updates]]></description>",
    );
  });

  it("omits undefined and undefined optional fields", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Test feed",
      generator: undefined,
      items: [],
      language: undefined,
      link: "https://example.com",
      title: "Test",
    });
    const xml = feed.generate();

    expect(xml).not.toContain("<language>");
    expect(xml).not.toContain("<generator>");
  });
});

describe("channel optional metadata", () => {
  it("includes optional fields with CDATA", () => {
    expect.hasAssertions();

    const feed = new Feed({
      category: "Tech",
      description: "Desc",
      generator: "Rivu",
      items: [],
      language: "en",
      link: "https://example.com",
      title: "Feed",
    });
    const xml = feed.generate();

    expect(xml).toContain("<language><![CDATA[en]]></language>");
    expect(xml).toContain("<generator><![CDATA[Rivu]]></generator>");
    expect(xml).toContain("<category><![CDATA[Tech]]></category>");
  });
});

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

describe("feed items url serialization", () => {
  it("url objects on item link and comments serialize to their href", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Testing items",
      items: [
        {
          comments: new URL("https://example.com/post#comments"),
          link: new URL("https://example.com/post"),
          title: "Item",
        },
      ],
      link: "https://example.com",
      title: "URL fields",
    });
    const xml = feed.generate();

    expect(xml).toContain("<link><![CDATA[https://example.com/post]]></link>");
    expect(xml).toContain(
      "<comments><![CDATA[https://example.com/post#comments]]></comments>",
    );
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
