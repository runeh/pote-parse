/**
 * Helper script that dumps out some blocks of example data that I copy into the
 * readme.
 */

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { normalize, parse } = require('../dist/index.cjs');

const exampleData = [
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

function main() {
  const parsed = parse(exampleData);
  const normalized = normalize(parsed);

  const parseExampleBlock = `
  
  \`\`\`typescript
  import { parse } from 'pote-parse';

  const rawPortableText = ${JSON.stringify(exampleData, null, 2)};

  const parsed = parse(rawPortableText);
  \`\`\`
  `;

  const parseResultBlock = `
  \`\`\`typescript
  ${JSON.stringify(parsed, null, 2)}
  \`\`\`
  `;

  const normalizeExampleBlock = `
  \`\`\`typescript
  import { normalize, parse } from 'pote-parse';

  const rawPortableText = ${JSON.stringify(exampleData, null, 2)};

  const parsed = parse(rawPortableText);
  const normalized = normalize(parsed);
  \`\`\`
  `;

  const normalizeResultBlock = `
  \`\`\`typescript
  ${JSON.stringify(normalized, null, 2)}
  \`\`\`
  `;

  console.log(parseExampleBlock);
  console.log('-----------');
  console.log(parseResultBlock);
  console.log('-----------');
  console.log(normalizeExampleBlock);
  console.log('-----------');
  console.log(normalizeResultBlock);
}

main();
