import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";

vi.setConfig({ testTimeout: 10_000 });

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
