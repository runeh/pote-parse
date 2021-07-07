# pote-parse

Parser and normalizer for
[Portable Text](https://github.com/portabletext/portabletext)

The module can perform two tasks:

1. Parse blocks of Portable Text into typed objects.
2. Normalize Portable Text into a richer representation that can be useful for
   tools consuming or converting Portable Text.

The module is similar to
[block-content-tree](https://github.com/sanity-io/block-content-to-tree-js).
This module uses typescript, so it tried to provide type-safe versions of the
parsed data. It also differs a bit in how lists are represented.

To install:

```
npm install pote-parse

# or

yarn add pote-parse
```

## Parsing

See the type definitions for the output from `parse` at the top of the
[./src/parser.ts](./src/parser.ts) file

### Example

```typescript
import { parse } from 'pote-parse';

const rawPortableText = [
  {
    _key: '07255f9a8e82',
    _type: 'block',
    children: [
      {
        _key: '432ab17c670d',
        _type: 'span',
        marks: [],
        text: 'Hello world!',
      },
      {
        _key: '2c01f20ff18d',
        _type: 'span',
        marks: ['c2586df86f96'],
        text: 'Link here!',
      },
    ],
    markDefs: [
      {
        _key: 'c2586df86f96',
        _type: 'link',
        href: 'http://example.org/',
      },
    ],
    style: 'h2',
  },
  {
    _key: '461abbd2c0fa',
    _type: 'block',
    children: [
      {
        _key: '061f2f58c404',
        _type: 'span',
        marks: [],
        text: 'First bullet point',
      },
    ],
    level: 1,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '46b3264f5aaa',
    _type: 'block',
    children: [
      {
        _key: '38376c2e9d32',
        _type: 'span',
        marks: [],
        text: 'Nested bullet point',
      },
    ],
    level: 2,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'e64fe4340412',
    _type: 'image',
    asset: {
      _ref: 'my-image.jpg',
      _type: 'reference',
    },
  },
];

const parsed = parse(rawPortableText);
```

The value of `parsed` will be identical to the input, except that the blocks
have a `kind` field:

```typescript
[
  {
    kind: 'text',
    _key: '07255f9a8e82',
    _type: 'block',
    children: [
      {
        _key: '432ab17c670d',
        _type: 'span',
        marks: [],
        text: 'Hello world!',
      },
      {
        _key: '2c01f20ff18d',
        _type: 'span',
        marks: ['c2586df86f96'],
        text: 'Link here!',
      },
    ],
    markDefs: [
      {
        _key: 'c2586df86f96',
        _type: 'link',
        href: 'http://example.org/',
      },
    ],
    style: 'h2',
  },
  {
    kind: 'list',
    _key: '461abbd2c0fa',
    _type: 'block',
    children: [
      {
        _key: '061f2f58c404',
        _type: 'span',
        marks: [],
        text: 'First bullet point',
      },
    ],
    level: 1,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    kind: 'list',
    _key: '46b3264f5aaa',
    _type: 'block',
    children: [
      {
        _key: '38376c2e9d32',
        _type: 'span',
        marks: [],
        text: 'Nested bullet point',
      },
    ],
    level: 2,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    kind: 'custom',
    _key: 'e64fe4340412',
    _type: 'image',
    asset: {
      _ref: 'my-image.jpg',
      _type: 'reference',
    },
  },
];
```

## Normalization

See the type definitions for the output from `parse` at the top of the
[./src/normalizer.ts](./src/normalizer.ts) file

```typescript
import { normalize, parse } from 'pote-parse';

const rawPortableText = [
  {
    _key: '07255f9a8e82',
    _type: 'block',
    children: [
      {
        _key: '432ab17c670d',
        _type: 'span',
        marks: [],
        text: 'Hello world!',
      },
      {
        _key: '2c01f20ff18d',
        _type: 'span',
        marks: ['c2586df86f96'],
        text: 'Link here!',
      },
    ],
    markDefs: [
      {
        _key: 'c2586df86f96',
        _type: 'link',
        href: 'http://example.org/',
      },
    ],
    style: 'h2',
  },
  {
    _key: '461abbd2c0fa',
    _type: 'block',
    children: [
      {
        _key: '061f2f58c404',
        _type: 'span',
        marks: [],
        text: 'First bullet point',
      },
    ],
    level: 1,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '46b3264f5aaa',
    _type: 'block',
    children: [
      {
        _key: '38376c2e9d32',
        _type: 'span',
        marks: [],
        text: 'Nested bullet point',
      },
    ],
    level: 2,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'e64fe4340412',
    _type: 'image',
    asset: {
      _ref: 'my-image.jpg',
      _type: 'reference',
    },
  },
];

const parsed = parse(rawPortableText);
const normalized = normalize(parsed);
```

The normalized output is an array of blocks. Each block can be a text block, a
custom block or a list block. List blocks can have children that are text blocks
or list blocks, when there are nested lists.

In addition, all marks are represented as objects with a `type` field, and an
optional `options` field that contains all metadata from a markDef.

The markDefs array is removed, and the markDef info moved into the marks
objects.

Normalized Portable Text:

```typescript
[
  {
    kind: 'text',
    key: '07255f9a8e82',
    style: 'h2',
    spans: [
      {
        key: '432ab17c670d',
        type: 'span',
        text: 'Hello world!',
        marks: [],
      },
      {
        key: '2c01f20ff18d',
        type: 'span',
        text: 'Link here!',
        marks: [
          {
            type: 'link',
            options: {
              href: 'http://example.org/',
            },
          },
        ],
      },
    ],
  },
  {
    kind: 'list',
    level: 1,
    type: 'bullet',
    children: [
      {
        kind: 'text',
        key: '461abbd2c0fa',
        style: 'normal',
        spans: [
          {
            key: '061f2f58c404',
            type: 'span',
            text: 'First bullet point',
            marks: [],
          },
        ],
      },
      {
        kind: 'list',
        level: 2,
        type: 'bullet',
        children: [
          {
            kind: 'text',
            key: '46b3264f5aaa',
            style: 'normal',
            spans: [
              {
                key: '38376c2e9d32',
                type: 'span',
                text: 'Nested bullet point',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'custom',
    type: 'image',
    key: 'e64fe4340412',
    fields: {
      asset: {
        _ref: 'my-image.jpg',
        _type: 'reference',
      },
    },
  },
];
```
