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
      new URL("https://example.com/rss.xsl"),
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
      new URL("https://example.com/rss.CSS?v=2"),
    );
    const xml = feed.generate();

    expect(xml).toContain(
      '<?xml-stylesheet type="text/css" href="https://example.com/rss.CSS?v=2"?>',
    );
  });
});
