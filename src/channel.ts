import type { ChannelElements, ChildNode, TextInput } from "./types.ts";

/**
 * @description Builds the sub-elements of `<image>`.
 *
 * The RSS 2.0 specification requires `<image>` to contain `<url>`, `<title>`
 * and `<link>`, where the latter two match the channel's own values.
 *
 * @param { ChannelElements } channel - The channel metadata.
 *
 * @returns { ChildNode[] | undefined } The sub-elements, or `undefined` when no
 *   image was provided so the element is omitted.
 */
function imageNodes(channel: ChannelElements): ChildNode[] | undefined {
  if (!channel.image) {
    return undefined;
  }

  return [
    { name: "url", value: channel.image },
    { cdata: true, name: "title", value: channel.title },
    { name: "link", value: channel.link },
  ];
}

/**
 * @description Builds the sub-elements of `<textInput>`.
 *
 * @param { TextInput | null } [textInput] - The text input metadata.
 *
 * @returns { ChildNode[] | undefined } The sub-elements, or `undefined` when no
 *   text input was provided so the element is omitted.
 */
function textInputNodes(textInput?: TextInput | null): ChildNode[] | undefined {
  if (!textInput) {
    return undefined;
  }

  return [
    { name: "title", value: textInput.title },
    { name: "description", value: textInput.description },
    { name: "name", value: textInput.name },
    { name: "link", value: textInput.link },
  ];
}

/**
 * @description Builds one sub-element per value for list elements such as
 * `<skipHours>` and `<skipDays>`.
 *
 * A single value is treated as a one-item list and duplicates are emitted once.
 * An empty result makes `buildNode()` omit the parent element.
 *
 * @param { string } name - The name of each sub-element, e.g. `hour`.
 * @param { string | number | (string | number)[] | null } [values] - The value
 *   or list of values to serialize.
 *
 * @returns { ChildNode[] } One node per distinct value.
 */
function listNodes(
  name: string,
  values?: string | number | (string | number)[] | null,
): ChildNode[] {
  return [...new Set([values ?? []].flat())].map((value) => ({ name, value }));
}

export { imageNodes, textInputNodes, listNodes };
