import { describe, expect, it } from "vitest";
import { Feed } from "../src/index.ts";

describe("Feed.generate()", () => {
  it("generates required fields wrapped in CDATA", () => {
    const feed = new Feed({
      title: "My Blog",
      link: "https://example.com",
      description: "Latest updates",
      items: [],
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
      title: "Test",
      link: "https://example.com",
      description: "Test feed",
      language: null,
      generator: undefined,
      items: [],
    });

    const xml = feed.generate();

    expect(xml).not.toContain("<language>");
    expect(xml).not.toContain("<generator>");
  });

  it("includes optional fields with CDATA", () => {
    const feed = new Feed({
      title: "Feed",
      link: "https://example.com",
      description: "Desc",
      language: "en",
      generator: "Rivu",
      category: "Tech",
      items: [],
    });

    const xml = feed.generate();

    expect(xml).toContain("<language><![CDATA[en]]></language>");
    expect(xml).toContain("<generator><![CDATA[Rivu]]></generator>");
    expect(xml).toContain("<category><![CDATA[Tech]]></category>");
  });

  it("omits date fields when not valid Date instance", () => {
    const feed = new Feed({
      title: "Invalid dates",
      link: "https://example.com",
      description: "Null dates",
      pubDate: null,
      lastBuildDate: undefined,
      items: [],
    });

    const xml = feed.generate();

    expect(xml).not.toContain("<pubDate>");
    expect(xml).not.toContain("<lastBuildDate>");
  });

  it("includes items wrapped in CDATA when provided", () => {
    const feed = new Feed({
      title: "Feed With Items",
      link: "https://example.com",
      description: "Has items",
      items: [
        {
          title: "Item One",
          description: "Description for item",
          pubDate: new Date("2025-10-10"),
        },
      ],
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
      title: "Full Item Fields",
      link: "https://example.com",
      description: "Testing items",
      items: [
        {
          title: "Item Title",
          link: "https://example.com/post-1",
          description: "Item Desc",
          author: "author@example.com (Author Name)",
          category: "Tech",
          comments: "https://example.com/post-1#comments",
          guid: "https://example.com/post-1",
          pubDate: new Date("2025-10-10T00:00:00Z"),
        },
      ],
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
      title: "Sparse Item",
      link: "https://example.com",
      description: "Testing items",
      items: [
        {
          title: "Only Title",
          link: undefined,
          author: null,
          category: undefined,
          comments: null,
          guid: undefined,
          pubDate: null,
        },
      ],
    });

    const xml = feed.generate();

    // Scope omission assertions to the `<item>` block to avoid colliding with
    // channel-level fields like `<link>` and `<pubDate>` that share the same
    // tag names.
    const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
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
      title: "Bad item pubDate",
      link: "https://example.com",
      description: "Testing items",
      items: [
        {
          title: "Item",
          pubDate: "not a date" as unknown as Date,
        },
      ],
    });

    const xml = feed.generate();

    expect(xml).toContain("<item>");
    expect(xml).not.toContain("<pubDate>");
  });

  it("URL objects on item link and comments serialize to their href", () => {
    const feed = new Feed({
      title: "URL fields",
      link: "https://example.com",
      description: "Testing items",
      items: [
        {
          title: "Item",
          link: new URL("https://example.com/post"),
          comments: new URL("https://example.com/post#comments"),
        },
      ],
    });

    const xml = feed.generate();

    expect(xml).toContain("<link><![CDATA[https://example.com/post]]></link>");
    expect(xml).toContain(
      "<comments><![CDATA[https://example.com/post#comments]]></comments>",
    );
  });

  it("produces pretty printed XML", () => {
    const feed = new Feed({
      title: "Pretty",
      link: "https://example.com",
      description: "Test pretty",
      items: [],
    });

    const xml = feed.generate();

    // still validating pretty-printing behavior
    expect(xml).toMatch(/\n\s*<channel>/);
  });
});
