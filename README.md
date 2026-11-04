# Rivu - Type-Safe RSS 2.0 Feed Generator

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

Install Rivu right now using the following commands:

```console
pnpm i rivu
```

## Quick Usage

You can quickly generate a RSS 2.0 output with the following lines of code:

```typescript
import { Feed } from "rivu";

const feed = new Feed({
  title: "Somraj's Blog",
  link: "https://jarmos.dev/rss.xml",
  description:
    "The personal blog (and digital garden) maintained by Somraj Saha (aka Jarmos).",
  language: "en-US",
  items: [
    {
      title: "Example Blog",
      description: "Lorem Ipsum",
      pubDate: new Date("2025-10-10"),
    },
  ],
});

feed.generate();
```

This should print a full RSS 2.0 feed as a string like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    ...
  </channel>
</rss>
```

### Atom 1.0 Feeds

The same feed can also be generated as an Atom 1.0 document by passing `"atom"`
to `generate()`:

```typescript
feed.generate("atom");
```

The channel metadata and items are mapped to their closest Atom equivalents
(e.g. `description` becomes `<subtitle>` and an item's `guid` becomes the
entry's `<id>`) while RSS-only fields like `ttl` or `skipDays` are omitted.

For more information with regards to the API reference, a more detailed usage
guide and the contribution guidelines, check out
[the official documentation](https://rivu.jarmos.dev).

## Licensing and Distribution Rights

The package is built using open-source tools and the source code of the package
itself is also provided publicly accessible under an open-source license.
Therefore, you are free to copy, modify and/or distribute the package under the
T&Cs of the MIT license. For more information about the distribution rights in
the [LICENSE](./LICENSE) document.
