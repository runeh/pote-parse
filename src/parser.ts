export interface Child {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface MarkDef {
  _key: string;
  _type: string;
  [optionName: string]: unknown;
}

export interface TextBlock {
  kind: 'text';
  _key: string;
  _type: string;
  style: string;
  markDefs: MarkDef[];
  children: Child[];
}

export interface ListBlock {
  kind: 'list';
  _key: string;
  _type: string;
  level: number;
  listItem: string;
  markDefs: MarkDef[];
  children: Child[];
  style: string;
}

export interface CustomBlock {
  kind: 'custom';
  _key: string;
  _type: string;
  [customOptionName: string]: unknown;
}

// Helper interface used during parsing. Any kind of thing with _key/_type
interface GenericPortableTextObject {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export type PortableTextBlock = ListBlock | TextBlock | CustomBlock;

export type PortableText = PortableTextBlock[];

function isPortableTextObject(
  thing: unknown,
): thing is GenericPortableTextObject {
  return (
    typeof thing === 'object' &&
    thing != null &&
    '_key' in thing &&
    typeof (thing as any)._key === 'string' &&
    typeof (thing as any)._type === 'string'
  );
}

function looksLikeTextBlock(
  block: unknown,
): block is GenericPortableTextObject {
  return (
    isPortableTextObject(block) &&
    block._type === 'block' &&
    typeof block['style'] === 'string' &&
    Array.isArray(block['children']) &&
    Array.isArray(block['markDefs'])
  );
}

function looksLikeListBlock(
  block: unknown,
): block is GenericPortableTextObject {
  return (
    isPortableTextObject(block) &&
    looksLikeTextBlock(block) &&
    typeof block['level'] === 'number' &&
    typeof block['listItem'] === 'string'
  );
}

function looksLikeCustomBlock(
  block: unknown,
): block is GenericPortableTextObject {
  return isPortableTextObject(block) && block._type !== 'block';
}

export class ParseError extends Error {
  failedBlock: unknown;

  constructor(message: string, block: unknown) {
    super(message);
    this.failedBlock = block;
  }
}

function validateMarkDefs(thing: unknown) {
  if (!Array.isArray(thing)) {
    throw new ParseError('Unable to parse markDefs', thing);
  } else {
    thing.forEach((markDef) => {
      if (!isPortableTextObject(markDef)) {
        throw new ParseError('Unable to parse markDef', markDef);
      }
    });
  }
}

function validateChildren(thing: unknown) {
  if (!Array.isArray(thing)) {
    throw new ParseError('Unable to parse children', thing);
  } else {
    thing.forEach((child) => {
      const valid =
        isPortableTextObject(child) &&
        Array.isArray(child['marks']) &&
        child['marks'].every((e) => typeof e === 'string') &&
        typeof child['text'] === 'string';

      if (!valid) {
        throw new ParseError('Unable to parse child', child);
      }
    });
  }
}

/**
 * Type checks Portable Text and adds discriminants to the returned objects.
 *
 * Note that this could be quite a bit more terse, but at the expense of not
 * being able to report which block/child/markDef that could not be parsed.
 */
function parseBlock(block: unknown): ListBlock | TextBlock | CustomBlock {
  if (looksLikeListBlock(block)) {
    validateChildren(block['children']);
    validateMarkDefs(block['markDefs']);
    return { kind: 'list', ...block } as ListBlock;
  } else if (looksLikeTextBlock(block)) {
    validateChildren(block['children']);
    validateMarkDefs(block['markDefs']);
    return { kind: 'text', ...block } as TextBlock;
  } else if (looksLikeCustomBlock(block)) {
    return { kind: 'custom', ...block } as CustomBlock;
  } else {
    throw new ParseError('Unable to parse block', block);
  }
}

/**
 * Parse and validate an array of Portable Text blocks. If the input is not
 * valid, throws a `ParseError` with a `failedBlock` property.
 * @param blocks
 * @returns PortableText
 */
export function parse(blocks: unknown[]): PortableText {
  return blocks.map(parseBlock);
}
