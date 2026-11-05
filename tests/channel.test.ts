import { describe, expect, it, vi } from "vitest";

import { Feed } from "../src/index.ts";
import type { ChannelElements } from "../src/types.ts";

vi.setConfig({ testTimeout: 10_000 });

const ONE_AM = 1;
const TWO_AM = 2;

const generate = (extra: Partial<ChannelElements>): string => {
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

    const xml = squash(generate({ image: "https://example.com/logo.png" }));

    expect(xml).toContain(
      "<image><url>https://example.com/logo.png</url><title><![CDATA[Example]]></title><link>https://example.com</link></image>",
    );
  });

  it("accepts a URL instance", () => {
    expect.hasAssertions();

    const xml = squash(
      generate({ image: new URL("https://example.com/logo.png") }),
    );

    expect(xml).toContain("<url>https://example.com/logo.png</url>");
  });

  it("omits the image element when no image is given", () => {
    expect.hasAssertions();

    expect(generate({})).not.toContain("<image>");
  });
});

describe("textInput", () => {
  it("nests title, description, name and link inside textInput", () => {
    expect.hasAssertions();

    const xml = squash(
      generate({
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

    expect(generate({})).not.toContain("<textInput>");
  });
});

describe("skipHours and skipDays", () => {
  it("wraps a single value in hour and day elements", () => {
    expect.hasAssertions();

    const xml = squash(generate({ skipDays: "Sunday", skipHours: 0 }));

    expect(xml).toContain("<skipHours><hour>0</hour></skipHours>");
    expect(xml).toContain("<skipDays><day>Sunday</day></skipDays>");
  });

  it("emits one element per unique value in a list", () => {
    expect.hasAssertions();

    const xml = squash(
      generate({
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

  it("omits both elements when not given", () => {
    expect.hasAssertions();

    const xml = generate({});

    expect(xml).not.toContain("<skipHours>");
    expect(xml).not.toContain("<skipDays>");
  });
});
