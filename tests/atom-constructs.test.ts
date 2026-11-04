import { describe, expect, it, vi } from "vitest";

import { parsePerson } from "../src/atom-constructs.ts";

vi.setConfig({ testTimeout: 10_000 });

describe("test the parsePerson() helper function", () => {
  it("splits the RSS `email (Name)` convention", () => {
    expect.hasAssertions();
    expect(parsePerson("jane@example.com (Jane Doe)")).toStrictEqual({
      email: "jane@example.com",
      name: "Jane Doe",
    });
  });

  it("uses a bare email address as both name and email", () => {
    expect.hasAssertions();
    expect(parsePerson(" jane@example.com ")).toStrictEqual({
      email: "jane@example.com",
      name: "jane@example.com",
    });
  });

  it("treats any other value as a name", () => {
    expect.hasAssertions();
    expect(parsePerson("Jane Doe")).toStrictEqual({ name: "Jane Doe" });
  });
});
