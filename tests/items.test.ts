import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";
import type { ItemElements } from "../src/types.ts";

vi.setConfig({ testTimeout: 10_000 });

const generate = (items: ItemElements[]): string =>
  new Feed({
    description: "Items",
    items,
    link: "https://example.com",
    title: "Items",
  })
    .generate()
    .replaceAll(/>\s+</gu, "><");

describe("item fields", () => {
  it("serializes every item field in specification order", () => {
    expect.hasAssertions();

    const xml = generate([
      {
        author: "jane@example.com (Jane Doe)",
        category: "Engineering",
        comments: new URL("https://example.com/post#comments"),
        description: "A short summary",
        guid: "https://example.com/post",
        link: new URL("https://example.com/post"),
        // oxlint-disable-next-line eslint/no-magic-numbers
        pubDate: new Date(Date.UTC(2025, 9, 10)),
        title: "A post",
      },
    ]);

    expect(xml).toContain(
      [
        "<item>",
        "<title><![CDATA[A post]]></title>",
        "<link>https://example.com/post</link>",
        "<description><![CDATA[A short summary]]></description>",
        "<author>jane@example.com (Jane Doe)</author>",
        "<category>Engineering</category>",
        "<comments>https://example.com/post#comments</comments>",
        '<guid isPermaLink="true">https://example.com/post</guid>',
        "<pubDate>Fri, 10 Oct 2025 00:00:00 GMT</pubDate>",
        "</item>",
      ].join(""),
    );
  });

  it("omits fields that are not provided", () => {
    expect.hasAssertions();

    const xml = generate([{ title: "Only a title" }]);

    expect(xml).toContain(
      "<item><title><![CDATA[Only a title]]></title></item>",
    );
  });
});

describe("item content", () => {
  it("marks a non-URL guid as not a permalink", () => {
    expect.hasAssertions();

    const xml = generate([{ guid: "post-42", title: "A post" }]);

    expect(xml).toContain('<guid isPermaLink="false">post-42</guid>');
  });

  it("escapes markup-free text and wraps markup in CDATA", () => {
    expect.hasAssertions();

    const xml = generate([
      { author: "Tom & Jerry", description: "<p>Hello</p>", title: "Post" },
    ]);

    expect(xml).toContain("<author>Tom &amp; Jerry</author>");
    expect(xml).toContain(
      "<description><![CDATA[<p>Hello</p>]]></description>",
    );
  });
});

describe("item list", () => {
  it("emits one item element per entry, in order", () => {
    expect.hasAssertions();

    const xml = generate([{ title: "First" }, { title: "Second" }]);

    expect(xml).toContain(
      "<item><title><![CDATA[First]]></title></item><item><title><![CDATA[Second]]></title></item>",
    );
  });

  it("emits no item elements for an empty list", () => {
    expect.hasAssertions();

    expect(generate([])).not.toContain("<item>");
  });

  it("emits no item elements when items is missing at runtime", () => {
    expect.hasAssertions();

    // @ts-expect-error - Testing runtime safety with a missing items list
    const feed = new Feed({
      description: "Items",
      link: "https://example.com",
      title: "Items",
    });

    expect(feed.generate()).not.toContain("<item>");
  });
});
