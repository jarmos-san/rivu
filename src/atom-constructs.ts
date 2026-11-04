import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";

import { appendContent, hasMarkup } from "./utils.ts";

/**
 * @description Represents an Atom person construct, used for the `<author>`
 * element of an Atom feed or entry.
 *
 * @see https://www.rfc-editor.org/rfc/rfc4287#section-3.2
 */
interface AtomPerson {
  /** @description The human-readable name of the person. */
  name: string;

  /** @description The email address associated with the person. */
  email?: string;
}

/**
 * @description Matches the conventional RSS 2.0 person format of `email
 * (Name)`, e.g. `jane@example.com (Jane Doe)`.
 */
const RSS_PERSON_PATTERN = /^(?<email>\S+@\S+)\s+\((?<name>[^)]+)\)$/u;

/** @description Matches a bare email address without a display name. */
const EMAIL_PATTERN = /^\S+@\S+$/u;

/**
 * @description Converts an RSS 2.0 style person string into an Atom person
 * construct.
 *
 * RSS uses free-form strings for people (conventionally `email (Name)`) while
 * Atom requires a `<name>` with an optional `<email>`. Strings in the RSS
 * convention are split into both parts, a bare email address is used as both
 * the name and the email, and anything else is treated as a name.
 *
 * @param { string } value - The RSS person string to convert.
 *
 * @returns { AtomPerson } The equivalent Atom person construct.
 */
const parsePerson = (value: string): AtomPerson => {
  const trimmed = value.trim();
  const match = RSS_PERSON_PATTERN.exec(trimmed);
  const { email = "", name = "" } = match === null ? {} : (match.groups ?? {});

  if (email && name) {
    return { email, name: name.trim() };
  }

  if (EMAIL_PATTERN.test(trimmed)) {
    return { email: trimmed, name: trimmed };
  }

  return { name: trimmed };
};

/**
 * @description Appends a simple text element to the provided XML element if the
 * value is set, otherwise the element is omitted.
 *
 * @param { XMLBuilder } parent - The element to append to.
 * @param { string } name - The name of the element.
 * @param { string | URL | null } [value] - The text content of the element.
 */
const appendElement = (
  parent: XMLBuilder,
  name: string,
  value?: string | URL | null,
): void => {
  if (value) {
    parent.ele(name).txt(String(value)).up();
  }
};

/**
 * @description Appends an Atom text construct (e.g. `<title>`, `<summary>`) to
 * the provided XML element if the value is set.
 *
 * Values containing markup are marked as `type="html"` and wrapped in a CDATA
 * section, otherwise they are serialized as escaped plain text. Unlike
 * {@link appendElement}, an empty string is still serialized since some text
 * constructs (like `<title>`) are required.
 *
 * @param { XMLBuilder } parent - The element to append the text construct to.
 * @param { string } name - The name of the text construct element.
 * @param { string | null } [value] - The text content.
 */
const appendText = (
  parent: XMLBuilder,
  name: string,
  value?: string | null,
): void => {
  if (value === undefined || value === null) {
    return;
  }

  const element = parent.ele(name);

  if (hasMarkup(value)) {
    element.att("type", "html");
  }

  appendContent(element, value);
  element.up();
};

/**
 * @description Appends a `<link>` element with the given relation to the
 * provided XML element if the URL is set.
 *
 * @param { XMLBuilder } parent - The element to append the link to.
 * @param { string | URL | null } href - The URL the link points to.
 * @param { string } rel - The relation of the link (e.g. `alternate`).
 */
const appendLink = (
  parent: XMLBuilder,
  href: string | URL | null | undefined,
  rel: string,
): void => {
  if (href) {
    parent.ele("link", { href: String(href), rel }).up();
  }
};

/**
 * @description Appends a `<category>` element to the provided XML element if
 * the term is set.
 *
 * @param { XMLBuilder } parent - The element to append the category to.
 * @param { string | null } [term] - The category term.
 */
const appendCategory = (parent: XMLBuilder, term?: string | null): void => {
  if (term) {
    parent.ele("category", { term }).up();
  }
};

/**
 * @description Appends an Atom person construct (`<author>`) to the provided
 * XML element if the value is set.
 *
 * @param { XMLBuilder } parent - The element to append the person to.
 * @param { string | null } [value] - The RSS style person string, see
 *   {@link parsePerson}.
 */
const appendAuthor = (parent: XMLBuilder, value?: string | null): void => {
  if (!value) {
    return;
  }

  const person = parsePerson(value);
  const author = parent.ele("author");

  appendElement(author, "name", person.name);
  appendElement(author, "email", person.email);
  author.up();
};

export {
  appendAuthor,
  appendCategory,
  appendElement,
  appendLink,
  appendText,
  parsePerson,
};
