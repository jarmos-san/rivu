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

<details>
<summary>Install Rivu</summary>
### `npm`

```console
npm install rivu
```

```console
pnpm add rivu
```

```console
yarn add rivu
```

</details>

## Getting Started

With Rivu installed and ready for use, you can get started with the package by
following these instructions:

1. Create a TypeScript file (for example, `feed.ts`) and ensure the file can be
   executed using Node.js.

2. Add the following contents the `feed.ts` file:

   ```ts
   import Feed from "rivu";

   const feed = new Feed(
     {
       // See https://www.rssboard.org/rss-specification for reference.
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
       // Additional metadata and configuration options required to enhance the RSS feed
       // output.
       feedURL: "https://example.com/rss.xml",
       stylesheet: new URL("https://example.com/rss.xsl"),
     },
   );

   console.log(feed.generate());
   ```

3. Run the script using the `node feed.ts` command in your terminal. You should
   expect the following output thereafter:

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

Refer to the official documentation here -
[rivu.jarmos.dev](https://rivu.jarmos.dev) and the
[RSS 2.0 Specification](https://www.rssboard.org/rss-specification) to learn
more about the implementation details.

## Licensing and Distribution Rights

The package is built using open-source tools and the source code of the package
itself is also provided publicly accessible under an open-source license.
Therefore, you are free to copy, modify and/or distribute the package under the
T&Cs of the MIT license. For more information about the distribution rights in
the [LICENSE](./LICENSE) document.
