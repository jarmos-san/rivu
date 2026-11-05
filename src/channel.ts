import type { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";

import type { ChannelElements, TextInput } from "./types.ts";
import { appendContent } from "./utils.ts";

const EMPTY = 0;

/** @description A single sub-element to append under a parent element. */
interface ChildNode {
  /** @description The name of the sub-element. */
  name: string;

  /** @description The value of the sub-element, converted to a string. */
  value: string | URL;

  /** @description Whether to wrap the value in a CDATA section. */
  cdata?: boolean;
}

/** @description The options accepted by {@link addListEl}. */
interface ListNodeOption {
  /** @description The XML node to append the parent element to. */
  doc: XMLBuilder;

  /** @description The name of the parent element, e.g. `skipHours`. */
  parent: string;

  /** @description The name of each child element, e.g. `hour`. */
  child: string;

  /** @description A single value or a list of values to serialize. */
  values: string | number | (string | number)[] | null | undefined;
}

/**
 * @description Appends a parent element named `name` holding the given
 * sub-elements in order.
 *
 * @param { XMLBuilder } doc - The XML node to append the parent element to.
 * @param { string } name - The name of the parent element.
 * @param { ChildNode[] } children - The sub-elements to append.
 */
function appendParent(
  doc: XMLBuilder,
  name: string,
  children: ChildNode[],
): void {
  const parentEl = doc.ele(name);

  for (const child of children) {
    const childEl = parentEl.ele(child.name);
    appendContent(childEl, String(child.value), child.cdata);
    childEl.up();
  }

  parentEl.up();
}

/**
 * @description Appends the `<image>` element to the `<channel>` node.
 *
 * The RSS 2.0 specification requires `<image>` to contain `<url>`, `<title>`
 * and `<link>` sub-elements, where the latter two should match the channel's
 * own values. Nothing is appended if no `image` was provided.
 *
 * @param { XMLBuilder } doc - The `<channel>` XML node.
 * @param { ChannelElements } channel - The channel metadata.
 */
function addImageEl(doc: XMLBuilder, channel: ChannelElements): void {
  if (!channel.image) {
    return;
  }

  appendParent(doc, "image", [
    { name: "url", value: channel.image },
    { cdata: true, name: "title", value: channel.title },
    { name: "link", value: channel.link },
  ]);
}

/**
 * @description Appends the `<textInput>` element to the `<channel>` node.
 *
 * Each of the `title`, `description`, `name` and `link` properties becomes a
 * sub-element as required by the RSS 2.0 specification. Nothing is appended if
 * no `textInput` was provided.
 *
 * @param { XMLBuilder } doc - The `<channel>` XML node.
 * @param { TextInput | null } [textInput] - The text input metadata.
 */
function addTextInputEl(doc: XMLBuilder, textInput?: TextInput | null): void {
  if (!textInput) {
    return;
  }

  appendParent(doc, "textInput", [
    { name: "title", value: textInput.title },
    { name: "description", value: textInput.description },
    { name: "name", value: textInput.name },
    { name: "link", value: textInput.link },
  ]);
}

/**
 * @description Appends a parent element holding one child element per value,
 * such as `<skipHours><hour>0</hour></skipHours>`.
 *
 * A single value is treated as a one-item list and duplicate values are only
 * emitted once. Nothing is appended if no values were provided or the list is
 * empty.
 *
 * @param { ListNodeOption } options - The parent and child element names along
 *   with the values to serialize.
 */
function addListEl(options: ListNodeOption): void {
  const values = [...new Set([options.values ?? []].flat())];

  if (values.length > EMPTY) {
    appendParent(
      options.doc,
      options.parent,
      values.map((value) => ({ name: options.child, value: String(value) })),
    );
  }
}

/**
 * @description Appends the `<channel>` elements that need sub-elements:
 * `<image>`, `<textInput>`, `<skipHours>` and `<skipDays>`.
 *
 * @param { XMLBuilder } doc - The `<channel>` XML node.
 * @param { ChannelElements } channel - The channel metadata.
 */
function addNestedChannelEls(doc: XMLBuilder, channel: ChannelElements): void {
  addImageEl(doc, channel);
  addTextInputEl(doc, channel.textInput);
  addListEl({
    child: "hour",
    doc,
    parent: "skipHours",
    values: channel.skipHours,
  });
  addListEl({
    child: "day",
    doc,
    parent: "skipDays",
    values: channel.skipDays,
  });
}

export default addNestedChannelEls;
