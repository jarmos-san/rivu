import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";
import type { ChannelElements } from "../src/types.ts";

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

const ONE_AM = 1;
const TWO_AM = 2;

const generateChannel = (extra: Partial<ChannelElements>): string => {
  const channel: ChannelElements = {
    description: "Nested elements",
    items: [],
    link: "https://example.com",
    title: "Example",
  };

  return new Feed(Object.assign(channel, extra)).generate();
};

const squash = (xml: string): string => xml.replaceAll(/>\s+</gu, "><");

describe("image", () => {
  it("nests url, title and link inside the image element", () => {
    expect.hasAssertions();

    const xml = squash(
      generateChannel({ image: "https://example.com/logo.png" }),
    );

    expect(xml).toContain(
      "<image><url>https://example.com/logo.png</url><title><![CDATA[Example]]></title><link>https://example.com</link></image>",
    );
  });

  it("accepts a URL instance", () => {
    expect.hasAssertions();

    const xml = squash(
      generateChannel({ image: new URL("https://example.com/logo.png") }),
    );

    expect(xml).toContain("<url>https://example.com/logo.png</url>");
  });

  it("omits the image element when no image is given", () => {
    expect.hasAssertions();

    expect(generateChannel({})).not.toContain("<image>");
  });
});

describe("textInput", () => {
  it("nests title, description, name and link inside textInput", () => {
    expect.hasAssertions();

    const xml = squash(
      generateChannel({
        textInput: {
          description: "Search the site",
          link: new URL("https://example.com/search"),
          name: "q",
          title: "Search",
        },
      }),
    );

    expect(xml).toContain(
      "<textInput><title>Search</title><description>Search the site</description><name>q</name><link>https://example.com/search</link></textInput>",
    );
  });

  it("omits the textInput element when none is given", () => {
    expect.hasAssertions();

    expect(generateChannel({})).not.toContain("<textInput>");
  });
});

describe("skipHours and skipDays", () => {
  it("wraps a single value in hour and day elements", () => {
    expect.hasAssertions();

    const xml = squash(generateChannel({ skipDays: "Sunday", skipHours: 0 }));

    expect(xml).toContain("<skipHours><hour>0</hour></skipHours>");
    expect(xml).toContain("<skipDays><day>Sunday</day></skipDays>");
  });

  it("emits one element per unique value in a list", () => {
    expect.hasAssertions();

    const xml = squash(
      generateChannel({
        skipDays: ["Saturday", "Sunday", "Sunday"],
        skipHours: [ONE_AM, TWO_AM, TWO_AM],
      }),
    );

    expect(xml).toContain(
      "<skipHours><hour>1</hour><hour>2</hour></skipHours>",
    );
    expect(xml).toContain(
      "<skipDays><day>Saturday</day><day>Sunday</day></skipDays>",
    );
  });

  it("omits both elements for empty lists", () => {
    expect.hasAssertions();

    const xml = generateChannel({ skipDays: [], skipHours: [] });

    expect(xml).not.toContain("<skipHours");
    expect(xml).not.toContain("<skipDays");
  });

  it("omits both elements when not given", () => {
    expect.hasAssertions();

    const xml = generateChannel({});

    expect(xml).not.toContain("<skipHours>");
    expect(xml).not.toContain("<skipDays>");
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
