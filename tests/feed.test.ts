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

describe("pubDate fields", () => {
  it("formats channel and item pubDate as RFC 822", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Test pubDate",
      items: [{ pubDate: new Date("2025-10-10T00:00:00Z"), title: "Hello" }],
      link: "https://example.com",
      pubDate: new Date("2025-10-11T00:00:00Z"),
      title: "Dates",
    });
    const xml = feed.generate();

    expect(xml).toContain("<pubDate>Sat, 11 Oct 2025 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<pubDate>Fri, 10 Oct 2025 00:00:00 GMT</pubDate>");
  });
});
