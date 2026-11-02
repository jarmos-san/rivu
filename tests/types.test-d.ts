import { describe, expectTypeOf, it } from "vitest";

import type { ChannelElements, Days, Hour, RSS } from "../src/types.ts";

describe("src/types.ts:Days", () => {
  it("accepts valid day strings", () => {
    expectTypeOf<Days>().toEqualTypeOf<
      | "Sunday"
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
    >();
  });

  it("rejects invalid days strings", () => {
    // @ts-expect-error
    const bad: Days = "Funday";
    void bad;
  });
});

describe("src/types.ts:Hour", () => {
  it("accepts valid hour numbers", () => {
    expectTypeOf<Hour>().toEqualTypeOf<
      | 0
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | 10
      | 11
      | 12
      | 13
      | 14
      | 15
      | 16
      | 17
      | 18
      | 19
      | 20
      | 21
      | 22
      | 23
    >();
  });

  it("rejects invalid hour numbers", () => {
    // @ts-expect-error
    const bad: Hour = 24;
    void bad;
  });
});

describe("channelElements", () => {
  it("requires title, link, description, and items", () => {
    const valid: ChannelElements = {
      description: "My feed",
      items: [
        {
          pubDate: new Date(),
        },
      ],
      link: "https://example.com",
      title: "Example Feed",
    };
    void valid;
  });

  it("rejects missing required properties", () => {
    // @ts-expect-error - missing required fields
    const missing: ChannelElements = {};
    void missing;
  });

  it("validates optional skipDays + skipHours and textInput", () => {
    const withOptional: ChannelElements = {
      description: "Test",
      items: [],
      link: "https://example.com",
      skipDays: "Sunday",
      skipHours: 12,
      textInput: {
        description: "Search the feed",
        link: new URL("https://example.com/search"),
        name: "q",
        title: "Search",
      },
      title: "Example",
    };
    void withOptional;
  });
});

describe("rSS", () => {
  it("requires channelElements and generate()", () => {
    const feed: RSS = {
      channelElements: {
        description: "desc",
        items: [{ pubDate: new Date() }],
        link: "https://example.com",
        title: "Example",
      },
      generate() {
        return "<rss></rss>";
      },
    };
    void feed;
  });

  it("rejects missing channelElements", () => {
    // @ts-expect-error
    const bad: RSS = {
      generate() {
        return "";
      },
    };
    void bad;
  });
});
