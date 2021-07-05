import * as parser from './parser';

function invariant(condition: unknown, message?: string): asserts condition {
  if (condition) {
    return;
  } else {
    throw new Error(`Invariant failed: ${message || ''}`);
  }
}

export interface NormalizedMark {
  type: string;
  options?: Record<string, unknown>;
}

export interface NormalizedTextSpan {
  key: string;
  type: string; // can this be 'span' | 'link' ?
  marks: NormalizedMark[];
  text: string;
}

export interface NormalizedTextBlock {
  kind: 'text';
  key: string;
  style: string;
  spans: NormalizedTextSpan[];
}

export interface NormalizedCustomBlock {
  kind: 'custom';
  key: string;
  fields: Record<string, unknown>;
}

export interface NormalizedListBlock {
  kind: 'list';
  type: string;
  level: number;
  children: (NormalizedTextBlock | NormalizedListBlock)[];
}

export type NormalizedParsedPortableText = (
  | NormalizedTextBlock
  | NormalizedListBlock
  | NormalizedCustomBlock
)[];

function parseMarkDefs(
  markDefs: parser.MarkDef[],
): Record<string, NormalizedMark> {
  return Object.fromEntries(
    markDefs.map<[string, NormalizedMark]>((e) => {
      const { _key, _type, ...rest } = e;
      return [_key, { type: _type, options: rest }];
    }),
  );
}

function parseNonListBlock(
  block: parser.CustomBlock | parser.TextBlock,
): NormalizedTextBlock | NormalizedCustomBlock {
  if (block.kind === 'text') {
    const markDefsMap = parseMarkDefs(block.markDefs);
    const ret: NormalizedTextBlock = {
      kind: 'text',
      key: block._key,
      style: block.style,
      spans: parseSpans(markDefsMap, block.children),
    };
    return ret;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _key, _type, kind, ...rest } = block;
    const ret: NormalizedCustomBlock = {
      kind: 'custom',
      key: _key,
      fields: rest as Record<string, unknown>,
    };
    return ret;
  }
}

type Level = (parser.ListBlock | Level)[];

// try non-empty array?
// public for testing
export function groupByLevel(things: parser.ListBlock[]): Level {
  invariant(things.length > 0 && !Array.isArray(things[0]));

  const [first, ...rest] = things;
  const ret: Level = [first];
  let index = 0;

  while (index < rest.length) {
    const item = rest[index];
    if (item.level === first.level) {
      ret.push(item);
      index++;
    } else if (item.level > first.level) {
      const startIndex = rest.indexOf(item);
      const children = groupByLevel(rest.slice(startIndex));
      ret.push(children);
      index += children.flat().length;
    } else if (item.level < first.level) {
      return ret;
    }
  }
  return ret;
}

function parseListLevels(levels: Level): NormalizedListBlock {
  const [first] = levels;
  invariant(!Array.isArray(first));
  const block: NormalizedListBlock = {
    kind: 'list',
    level: first.level,
    type: first.listItem,
    children: [],
  };
  for (const level of levels) {
    if (Array.isArray(level)) {
      block.children.push(parseListLevels(level));
    } else {
      const markDefsMap = parseMarkDefs(level.markDefs);
      const ret: NormalizedTextBlock = {
        kind: 'text',
        key: level._key,
        style: level.style,
        spans: parseSpans(markDefsMap, level.children),
      };
      block.children.push(ret);
    }
  }

  return block;
}

function parseListBlocks(blocks: parser.ListBlock[]): NormalizedListBlock {
  return parseListLevels(groupByLevel(blocks));
}

function parseSpans(
  markDefsMap: Record<string, NormalizedMark>,
  spans: parser.Child[],
): NormalizedTextSpan[] {
  return spans.map<NormalizedTextSpan>((span) => {
    const { _key, _type, marks, text } = span;
    return {
      key: _key,
      type: _type,
      text,
      marks: marks.map((markKey) => {
        const markDef = markDefsMap[markKey];
        return markDef ? markDef : { type: markKey };
      }),
    };
  });
}

function isListBlock(
  block: parser.PortableTextBlock,
): block is parser.ListBlock {
  return block.kind === 'list';
}

export function normalize(
  portableText: parser.PortableText,
): (NormalizedTextBlock | NormalizedCustomBlock | NormalizedListBlock)[] {
  const ret: (
    | NormalizedTextBlock
    | NormalizedCustomBlock
    | NormalizedListBlock
  )[] = [];
  let index = 0;

  while (index < portableText.length) {
    const block = portableText[index];
    if (block.kind === 'list') {
      const foundIndex = portableText.findIndex(
        (e, n) => n > index && e.kind !== 'list',
      );
      const nextIndex = foundIndex === -1 ? portableText.length : foundIndex;
      const slice = portableText.slice(index, nextIndex);
      invariant(slice.every(isListBlock));
      ret.push(parseListBlocks(slice));
      index = nextIndex;
    } else {
      ret.push(parseNonListBlock(block));
      index++;
    }
  }

  return ret;
}
