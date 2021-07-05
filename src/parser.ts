import {
  PoteBlock,
  PoteChild,
  PoteCustomBlock,
  PoteListBlock,
  PoteMarkDef,
  PoteTextBlock,
  parsePortableText,
} from './raw-parser';

function invariant(condition: unknown, message?: string): asserts condition {
  if (condition) {
    return;
  } else {
    throw new Error(`Invariant failed: ${message || ''}`);
  }
}

interface Mark {
  type: string;
  options?: Record<string, unknown>;
}

interface TextSpan {
  key: string;
  type: string; // can this be 'span' | 'link' ?
  marks: Mark[];
  text: string;
}

interface StandardBlock {
  kind: 'text';
  key: string;
  style: string;
  spans: TextSpan[];
}

interface CustomBlock {
  kind: 'custom';
  key: string;
  fields: Record<string, unknown>;
}

interface ListBlock {
  kind: 'list';
  type: string;
  level: number;
  children: (StandardBlock | ListBlock)[];
}

export type ParsedPortableText = (StandardBlock | ListBlock | CustomBlock)[];

function parseMarkDefs(markDefs: PoteMarkDef[]): Record<string, Mark> {
  return Object.fromEntries(
    markDefs.map<[string, Mark]>((e) => {
      const { _key, _type, ...rest } = e;
      return [_key, { type: _type, options: rest }];
    }),
  );
}

function parseNonListBlock(
  block: PoteCustomBlock | PoteTextBlock,
): StandardBlock | CustomBlock {
  if (block.kind === 'text') {
    const markDefsMap = parseMarkDefs(block.markDefs);
    const ret: StandardBlock = {
      kind: 'text',
      key: block._key,
      style: block.style,
      spans: parseSpans(markDefsMap, block.children),
    };
    return ret;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _key, _type, kind, ...rest } = block;
    const ret: CustomBlock = {
      kind: 'custom',
      key: _key,
      fields: rest as Record<string, unknown>,
    };
    return ret;
  }
}

type Chunk = (PoteListBlock | Chunk)[];

// try non-empty array?
// public for testing
export function chunkit(things: PoteListBlock[]): Chunk {
  invariant(things.length > 0 && !Array.isArray(things[0]));

  const [first, ...rest] = things;
  const ret: Chunk = [first];
  let index = 0;

  while (index < rest.length) {
    const item = rest[index];
    if (item.level === first.level) {
      ret.push(item);
      index++;
    } else if (item.level > first.level) {
      const startIndex = rest.indexOf(item);
      const children = chunkit(rest.slice(startIndex));
      ret.push(children);
      index += children.flat().length;
    } else if (item.level < first.level) {
      return ret;
    }
  }
  return ret;
}

function parseListChunks(chunks: Chunk): ListBlock {
  const [first] = chunks;
  invariant(!Array.isArray(first));
  const block: ListBlock = {
    kind: 'list',
    level: first.level,
    type: first.listItem,
    children: [],
  };
  for (const chunk of chunks) {
    if (Array.isArray(chunk)) {
      block.children.push(parseListChunks(chunk));
    } else {
      const markDefsMap = parseMarkDefs(chunk.markDefs);
      const ret: StandardBlock = {
        kind: 'text',
        key: chunk._key,
        style: chunk.style,
        spans: parseSpans(markDefsMap, chunk.children),
      };
      block.children.push(ret);
    }
  }

  return block;
}

function parseListBlocks(blocks: PoteListBlock[]): ListBlock {
  return parseListChunks(chunkit(blocks));
}

function parseSpans(
  markDefsMap: Record<string, Mark>,
  spans: PoteChild[],
): TextSpan[] {
  return spans.map<TextSpan>((span) => {
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

function isPoteListBlock(block: PoteBlock): block is PoteListBlock {
  return block.kind === 'list';
}

export function parseBlocks(
  rawBlocks: unknown[],
): (StandardBlock | CustomBlock | ListBlock)[] {
  const blocks = parsePortableText(rawBlocks);

  const ret: (StandardBlock | CustomBlock | ListBlock)[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    if (block.kind === 'list') {
      const foundIndex = blocks.findIndex(
        (e, n) => n > index && e.kind !== 'list',
      );
      const nextIndex = foundIndex === -1 ? blocks.length : foundIndex;
      const slice = blocks.slice(index, nextIndex);
      invariant(slice.every(isPoteListBlock));
      ret.push(parseListBlocks(slice));
      index = nextIndex;
    } else {
      ret.push(parseNonListBlock(block));
      index++;
    }
  }

  return ret;
}
