# Rivu - Type-Safe RSS 2.0 Feed Generator

[![npm version](https://img.shields.io/npm/v/rivu)](https://www.npmjs.com/package/rivu)
[![Run tests](https://github.com/jarmos-san/rivu/actions/workflows/run-tests.yml/badge.svg)](https://github.com/jarmos-san/rivu/actions/workflows/run-tests.yml)
[![QA checks](https://github.com/jarmos-san/rivu/actions/workflows/qa-checks.yml/badge.svg)](https://github.com/jarmos-san/rivu/actions/workflows/qa-checks.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Rivu is a modern TypeScript library for generating RSS 2.0 feeds
programmatically. It enforces strict type safety, validates required channel
metadata and produces a fully compliant RSS feed as an XML document.

## Features

Rivu provides the following functionalities:

- 100% RSS 2.0 compliant output.
- Lightweight and fast (based on Node.js).
- Fully type-safe using TypeScript interfaces.
- Strict validation for required RSS channel fields.
- Custom feed items with rich optional metadata.
- Small footprint and works in Node.js and other JavaScript runtimes.

## Get Started

Install Rivu with your package manager of choice:

```bash
pnpm add rivu
```

It also works with `npm install rivu`, `yarn add rivu` and `bun add rivu`.
Then describe a channel and its items, call `generate()` and get back an XML
string:

```ts
import { Feed } from "rivu";

const feed = new Feed(
  {
    title: "Example Blog",
    link: "https://example.com",
    description: "Notes on building things.",
    language: "en-US",
    lastBuildDate: new Date("2025-10-12T09:30:00Z"),
    items: [
      {
        title: "Hello, world",
        link: "https://example.com/posts/hello-world",
        description: "<p>The first post.</p>",
        author: "jane@example.com (Jane Doe)",
        category: ["intro", "meta"],
        guid: "https://example.com/posts/hello-world",
        pubDate: new Date("2025-10-10T08:00:00Z"),
      },
    ],
  },
  {
    feedURL: "https://example.com/rss.xml",
    stylesheet: new URL("https://example.com/rss.xsl"),
  },
);

console.log(feed.generate());
```

`generate()` returns:

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="https://example.com/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="https://example.com/rss.xml" rel="self" type="application/rss+xml"/>
    <title><![CDATA[Example Blog]]></title>
    <link>https://example.com</link>
    <description><![CDATA[Notes on building things.]]></description>
    <language>en-US</language>
    <lastBuildDate>Sun, 12 Oct 2025 09:30:00 GMT</lastBuildDate>
    <item>
      <title><![CDATA[Hello, world]]></title>
      <link>https://example.com/posts/hello-world</link>
      <description><![CDATA[<p>The first post.</p>]]></description>
      <author>jane@example.com (Jane Doe)</author>
      <category>intro</category>
      <category>meta</category>
      <guid isPermaLink="true">https://example.com/posts/hello-world</guid>
      <pubDate>Fri, 10 Oct 2025 08:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
```

For the API reference, more detailed usage guides and the contribution
guidelines, check out [the official documentation](https://rivu.jarmos.dev).

## Licensing and Distribution Rights

The package is built using open-source tools and the source code of the package
itself is also provided publicly accessible under an open-source license.
Therefore, you are free to copy, modify and/or distribute the package under the
T&Cs of the MIT license. For more information about the distribution rights in
the [LICENSE](./LICENSE) document.
