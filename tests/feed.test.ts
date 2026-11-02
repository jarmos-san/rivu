import { describe, expect, it } from "vitest";

import { Feed } from "../src/index.ts";

describe("Feed.generate()", () => {
  it("generates required fields wrapped in CDATA", () => {
    const feed = new Feed({
      description: "Latest updates",
      items: [],
      link: "https://example.com",
      title: "My Blog",
    });

    const xml = feed.generate();

    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");

    // CDATA expectations
    expect(xml).toContain("<title><![CDATA[My Blog]]></title>");
    expect(xml).toContain("<link><![CDATA[https://example.com]]></link>");
    expect(xml).toContain(
      "<description><![CDATA[Latest updates]]></description>",
    );
  });

  it("omits null and undefined optional fields", () => {
    const feed = new Feed({
      description: "Test feed",
      generator: undefined,
      items: [],
      language: null,
      link: "https://example.com",
      title: "Test",
    });

    const xml = feed.generate();

    expect(xml).not.toContain("<language>");
    expect(xml).not.toContain("<generator>");
  });

  it("includes optional fields with CDATA", () => {
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

  it("omits date fields when not valid Date instance", () => {
    const feed = new Feed({
      description: "Null dates",
      items: [],
      lastBuildDate: undefined,
      link: "https://example.com",
      pubDate: null,
      title: "Invalid dates",
    });

    const xml = feed.generate();

    expect(xml).not.toContain("<pubDate>");
    expect(xml).not.toContain("<lastBuildDate>");
  });

  it("includes items wrapped in CDATA when provided", () => {
    const feed = new Feed({
      description: "Has items",
      items: [
        {
          description: "Description for item",
          pubDate: new Date("2025-10-10"),
          title: "Item One",
        },
      ],
      link: "https://example.com",
      title: "Feed With Items",
    });

    const xml = feed.generate();

    expect(xml).toContain("<item>");

    expect(xml).toContain("<title><![CDATA[Item One]]></title>");
    expect(xml).toContain(
      "<description><![CDATA[Description for item]]></description>",
    );
  });

  it("serializes all declared item subelements", () => {
    const feed = new Feed({
      description: "Testing items",
      items: [
        {
          author: "author@example.com (Author Name)",
          category: "Tech",
          comments: "https://example.com/post-1#comments",
          description: "Item Desc",
          guid: "https://example.com/post-1",
          link: "https://example.com/post-1",
          pubDate: new Date("2025-10-10T00:00:00Z"),
          title: "Item Title",
        },
      ],
      link: "https://example.com",
      title: "Full Item Fields",
    });

    const xml = feed.generate();

    expect(xml).toContain("<item>");
    expect(xml).toContain("<title><![CDATA[Item Title]]></title>");
    expect(xml).toContain(
      "<link><![CDATA[https://example.com/post-1]]></link>",
    );
    expect(xml).toContain("<description><![CDATA[Item Desc]]></description>");
    expect(xml).toContain(
      "<author><![CDATA[author@example.com (Author Name)]]></author>",
    );
    expect(xml).toContain("<category><![CDATA[Tech]]></category>");
    expect(xml).toContain(
      "<comments><![CDATA[https://example.com/post-1#comments]]></comments>",
    );
    expect(xml).toContain(
      "<guid><![CDATA[https://example.com/post-1]]></guid>",
    );
    expect(xml).toContain(
      `<pubDate><![CDATA[${new Date("2025-10-10T00:00:00Z").toUTCString()}]]></pubDate>`,
    );
  });

  it("omits item subelements when null or undefined", () => {
    const feed = new Feed({
      description: "Testing items",
      items: [
        {
          author: null,
          category: undefined,
          comments: null,
          guid: undefined,
          link: undefined,
          pubDate: null,
          title: "Only Title",
        },
      ],
      link: "https://example.com",
      title: "Sparse Item",
    });

    const xml = feed.generate();

    // Scope omission assertions to the `<item>` block to avoid colliding with
    // Channel-level fields like `<link>` and `<pubDate>` that share the same
    // Tag names.
    const itemMatch = /<item>([\s\S]*?)<\/item>/.exec(xml);
    expect(itemMatch).not.toBeNull();
    const itemBlock = itemMatch![1];

    expect(itemBlock).toContain("<title><![CDATA[Only Title]]></title>");
    expect(itemBlock).not.toContain("<link>");
    expect(itemBlock).not.toContain("<author>");
    expect(itemBlock).not.toContain("<category>");
    expect(itemBlock).not.toContain("<comments>");
    expect(itemBlock).not.toContain("<guid>");
    expect(itemBlock).not.toContain("<pubDate>");
  });

  it("omits item pubDate when not a valid Date instance", () => {
    const feed = new Feed({
      description: "Testing items",
      items: [
        {
          pubDate: "not a date" as unknown as Date,
          title: "Item",
        },
      ],
      link: "https://example.com",
      title: "Bad item pubDate",
    });

    const xml = feed.generate();

    expect(xml).toContain("<item>");
    expect(xml).not.toContain("<pubDate>");
  });

  it("URL objects on item link and comments serialize to their href", () => {
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

  it("produces pretty printed XML", () => {
    const feed = new Feed({
      description: "Test pretty",
      items: [],
      link: "https://example.com",
      title: "Pretty",
    });

    const xml = feed.generate();

    // Still validating pretty-printing behavior
    expect(xml).toMatch(/\n\s*<channel>/);
  });
});
