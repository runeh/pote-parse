# pote-parse

Parser and normalizer for
[Portable Text](https://github.com/portabletext/portabletext)

The module can perform two tasks:

1. Parse blocks of Portable Text into typed objects.
2. Normalize Portable Text into a richer representation that can be useful for
   tools consuming or converting Portable Text.

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
    _key: '0001',
    _type: 'block',
    children: [
      {
        _key: '2c01f20ff18d',
        _type: 'span',
        marks: [],
        text: 'What is Lorem Ipsum?',
      },
    ],
    markDefs: [],
    style: 'h2',
  },

  {
    _key: '0002',
    _type: 'block',
    children: [
      {
        _key: '2c01f20ff18d',
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
    _key: '0003',
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
const parsed = [
  {
    kind: 'text',
    _key: '0001',
    _type: 'block',
    children: [
      {
        _key: '2c01f20ff18d',
        _type: 'span',
        marks: [],
        text: 'What is Lorem Ipsum?',
      },
    ],
    markDefs: [],
    style: 'h2',
  },
  {
    kind: 'list',
    _key: '0002',
    _type: 'block',
    children: [
      {
        _key: '2c01f20ff18d',
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
    kind: 'custom',
    _key: '0003',
    _type: 'image',
    asset: {
      _ref: 'my-image.jpg',
      _type: 'reference',
    },
  },
];
```

Normalization

normalized output!

```typescript
const normalized = [
  {
    kind: 'text',
    key: '0001',
    style: 'h2',
    spans: [
      {
        key: '2c01f20ff18d',
        type: 'span',
        text: 'What is Lorem Ipsum?',
        marks: [],
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
        key: '0002',
        style: 'normal',
        spans: [
          {
            key: '2c01f20ff18d',
            type: 'span',
            text: 'First bullet point',
            marks: [],
          },
        ],
      },
    ],
  },
  {
    kind: 'custom',
    key: '0003',
    fields: {
      asset: {
        _ref: 'my-image.jpg',
        _type: 'reference',
      },
    },
  },
];
```

## todo

- Rewrite chunker stuff with a reduce? Will be confusing regardless, but save
  some lines probably?
- Try to have some arrays require at least one child?
- Go over naming
- Docs
- Add comments
- snapshot test that serializes to something human readable?
- Fix the examples so they actually use correct same data in input and output
  and don't duplicate the \_key
- Figure out the "normal" field. Just use yarn share or whatever and try it in
  svelte-pote
