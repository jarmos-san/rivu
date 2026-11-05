import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";

vi.setConfig({ testTimeout: 10_000 });

describe("xml safety", () => {
  it("does not throw when a CDATA field contains ]]>", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Ends with ]]> here",
      items: [{ description: "<p>x ]]> y</p>", title: "a ]]> b" }],
      link: "https://example.com",
      title: "Safety",
    });
    const xml = feed.generate();

    expect(xml).toContain("<title>a ]]&gt; b</title>");
    expect(xml).toContain(
      "<description>&lt;p&gt;x ]]&gt; y&lt;/p&gt;</description>",
    );
  });

  it("removes characters that are not allowed in XML", () => {
    expect.hasAssertions();

    const feed = new Feed({
      description: "Control characters",
      items: [{ title: "bad\u0001title" }],
      link: "https://example.com",
      title: "Safety",
    });

    expect(feed.generate()).toContain("<title><![CDATA[badtitle]]></title>");
  });
});
