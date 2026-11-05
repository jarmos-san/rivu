import { describe, it, expect, vi } from "vitest";
import type { XMLBuilder } from "xmlbuilder2/lib/interfaces";

import {
  isValidURL,
  formatDate,
  handleGUIDAttribute,
  appendContent,
} from "../src/utils.ts";

vi.setConfig({ testTimeout: 10_000 });

describe("test the isValidURL() helper function", () => {
  it("should return true for valid HTTP URLs", () => {
    expect.hasAssertions();
    expect(isValidURL("http://example.com")).toBeTruthy();
  });

  it("should return true for valid HTTPS URLs", () => {
    expect.hasAssertions();
    expect(isValidURL("https://jarmos.dev")).toBeTruthy();
  });

  it("should return false for non-http/https protocols", () => {
    expect.hasAssertions();
    expect(isValidURL("ftp://example.com")).toBeFalsy();
  });

  it("should return false for malformed or relative URLs", () => {
    expect.hasAssertions();
    expect(isValidURL("not-a-url")).toBeFalsy();
    expect(isValidURL("example.com")).toBeFalsy();
    expect(isValidURL("/relative/path")).toBeFalsy();
    expect(isValidURL("http://")).toBeFalsy();
    expect(isValidURL("")).toBeFalsy();
  });
});

describe("test the formatDate() helper function", () => {
  it("should return a UTC-formatted string for a valid Date instance", () => {
    expect.hasAssertions();

    // oxlint-disable-next-line eslint/no-magic-numbers
    const date = new Date(Date.UTC(2025, 9, 10, 0, 0, 0));

    expect(formatDate(date)).toBe("Fri, 10 Oct 2025 00:00:00 GMT");
  });

  it("should return undefined when no argument is provided", () => {
    expect.hasAssertions();
    expect(formatDate()).toBeUndefined();
  });

  it("should return undefined when undefined is explicitly passed", () => {
    expect.hasAssertions();
    expect(formatDate()).toBeUndefined();
  });

  it("should return undefined when null is passed at runtime", () => {
    expect.hasAssertions();
    // @ts-expect-error - Testing runtime safety with invalid input type
    // oxlint-disable-next-line eslint/no-null
    expect(formatDate(null)).toBeUndefined();
  });

  it("should return undefined when a non-Date object is passed at runtime", () => {
    expect.hasAssertions();
    // @ts-expect-error - Testing runtime safety with invalid input type
    expect(formatDate("2025-10-10")).toBeUndefined();
  });

  it("should return undefined for an invalid Date instance", () => {
    expect.hasAssertions();
    expect(formatDate(new Date("not a date"))).toBeUndefined();
  });
});

describe("test the handleGUIDAttribute() helper function", () => {
  it("should set isPermaLink to true when name is guid and value is a valid URL", () => {
    expect.hasAssertions();
    const mockElement = {
      att: vi.fn<(name: string, value: string) => unknown>(),
    } as unknown as XMLBuilder;

    handleGUIDAttribute(mockElement, "guid", "https://example.com");

    expect(mockElement.att).toHaveBeenCalledExactlyOnceWith(
      "isPermaLink",
      "true",
    );
  });

  it("should set isPermaLink to false when name is guid and value is an invalid URL", () => {
    expect.hasAssertions();
    const mockElement = {
      att: vi.fn<(name: string, value: string) => unknown>(),
    } as unknown as XMLBuilder;

    handleGUIDAttribute(mockElement, "guid", "invalid-guid-string");

    expect(mockElement.att).toHaveBeenCalledExactlyOnceWith(
      "isPermaLink",
      "false",
    );
  });

  it("should not call att when element name is not guid", () => {
    expect.hasAssertions();
    const mockElement = {
      att: vi.fn<(name: string, value: string) => unknown>(),
    } as unknown as XMLBuilder;

    handleGUIDAttribute(mockElement, "title", "https://example.com");

    expect(mockElement.att).not.toHaveBeenCalled();
  });
});

// oxlint-disable-next-line eslint/max-lines-per-function
describe("test the appendContent() helper function", () => {
  it("should use .dat() when cdata is explicitly set to true", () => {
    expect.hasAssertions();

    const mockElement = {
      dat: vi.fn<(value: string) => unknown>(),
      txt: vi.fn<(value: string) => unknown>(),
    } as unknown as XMLBuilder;

    appendContent(mockElement, "plain text", true);

    expect(mockElement.dat).toHaveBeenCalledExactlyOnceWith("plain text");
    expect(mockElement.txt).not.toHaveBeenCalled();
  });

  it("should use .dat() when HTML markup tags are automatically detected", () => {
    expect.hasAssertions();
    const mockElement = {
      dat: vi.fn<(value: string) => unknown>(),
      txt: vi.fn<(value: string) => unknown>(),
    } as unknown as XMLBuilder;

    appendContent(mockElement, "<p>Hello World</p>");

    expect(mockElement.dat).toHaveBeenCalledExactlyOnceWith(
      "<p>Hello World</p>",
    );
    expect(mockElement.txt).not.toHaveBeenCalled();
  });

  it("should use .txt() when cdata is false and no markup tags are present", () => {
    expect.hasAssertions();
    const mockElement = {
      dat: vi.fn<(value: string) => unknown>(),
      txt: vi.fn<(value: string) => unknown>(),
    } as unknown as XMLBuilder;

    appendContent(mockElement, "Hello World", false);

    expect(mockElement.txt).toHaveBeenCalledExactlyOnceWith("Hello World");
    expect(mockElement.dat).not.toHaveBeenCalled();
  });

  it("should use .txt() by default when cdata is omitted and no markup tags are present", () => {
    expect.hasAssertions();
    const mockElement = {
      dat: vi.fn<(value: string) => unknown>(),
      txt: vi.fn<(value: string) => unknown>(),
    } as unknown as XMLBuilder;

    appendContent(mockElement, "Hello World");

    expect(mockElement.txt).toHaveBeenCalledExactlyOnceWith("Hello World");
    expect(mockElement.dat).not.toHaveBeenCalled();
  });
});
