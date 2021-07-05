import { parseBlocks, groupByLevel } from '../parser';
import type { PortableText } from '../raw-parser';

type ExpectedReturn = ReturnType<typeof parseBlocks>;

describe('parser', () => {
  describe('smoke tests for grouping', () => {
    it('parser 1', () => {
      const blocks: PortableText = [
        {
          _key: '1',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '2',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '3',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          key: '2',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          key: '3',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it('parser 2', () => {
      const blocks: PortableText = [
        {
          _key: '1',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '2',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '3',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '4',
          _type: 'block',
          children: [],
          kind: 'list',
          level: 1,
          listItem: 'yup',
          markDefs: [],
          style: 'normal',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          key: '2',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          key: '3',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          kind: 'list',
          level: 1,
          type: 'yup',
          children: [
            {
              key: '4',
              kind: 'text',
              spans: [],
              style: 'normal',
            },
          ],
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it('parser 3', () => {
      const blocks: PortableText = [
        {
          _key: '1',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '2',
          _type: 'block',
          children: [],
          kind: 'list',
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '3',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '4',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [],
          style: 'normal',
        },

        {
          kind: 'list',
          level: 1,
          type: 'bullet',
          children: [{ kind: 'text', spans: [], key: '2', style: 'normal' }],
        },

        {
          key: '3',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          key: '4',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it('parser 4', () => {
      const blocks = [
        {
          _key: '1',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '2',
          _type: 'block',
          children: [],
          kind: 'list',
          level: 1,
          listItem: 'yup',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '3',
          _type: 'block',
          children: [],
          kind: 'list',
          level: 1,
          listItem: 'yup',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '4',
          _type: 'block',
          children: [],
          kind: 'text',
          markDefs: [],
          style: 'normal',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [],
          style: 'normal',
        },

        {
          kind: 'list',
          level: 1,
          type: 'yup',
          children: [
            { kind: 'text', style: 'normal', key: '2', spans: [] },
            { kind: 'text', style: 'normal', key: '3', spans: [] },
          ],
        },

        {
          key: '4',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
      ];

      expect(parsed.length).toEqual(3);

      expect(parsed).toEqual(expected);
    });

    it('parser 5', () => {
      const blocks = [
        {
          _key: '1',
          _type: 'block',
          children: [],
          kind: 'list',
          level: 1,
          listItem: 'yup',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '2',
          _type: 'block',
          markDefs: [],
          children: [],
          kind: 'text',
          style: 'normal',
        },
        {
          _key: '3',
          _type: 'block',
          markDefs: [],
          children: [],
          kind: 'text',
          style: 'normal',
        },
        {
          _key: '4',
          _type: 'block',
          markDefs: [],
          children: [],
          kind: 'text',
          style: 'normal',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          kind: 'list',
          level: 1,
          type: 'yup',
          children: [{ kind: 'text', key: '1', style: 'normal', spans: [] }],
        },
        {
          key: '2',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          key: '3',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
        {
          key: '4',
          kind: 'text',
          spans: [],
          style: 'normal',
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it('parser 6', () => {
      const parsed = parseBlocks([]);

      const expected: ExpectedReturn = [];

      expect(parsed).toEqual(expected);
    });
  });

  describe('span parsing', () => {
    it('span parsing 1', () => {
      const blocks = [
        {
          _key: '1',
          _type: 'block',
          children: [
            {
              _key: 'span-1',
              _type: 'span',
              marks: [],
              text: 'test',
            },
          ],
          markDefs: [],
          style: 'h2',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [
            {
              key: 'span-1',
              marks: [],
              text: 'test',
              type: 'span',
            },
          ],
          style: 'h2',
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it('span parsing 2', () => {
      const blocks = [
        {
          _key: '1',
          _type: 'block',
          children: [
            {
              _key: 'span-1',
              _type: 'span',
              marks: ['em'],
              text: 'test',
            },
          ],
          markDefs: [],
          style: 'h2',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [
            {
              key: 'span-1',
              marks: [
                {
                  type: 'em',
                },
              ],
              text: 'test',
              type: 'span',
            },
          ],
          style: 'h2',
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it('span parsing 3', () => {
      const blocks = [
        {
          _key: '1',
          _type: 'block',
          children: [
            {
              _key: 'span-1',
              _type: 'span',
              marks: ['linkdef'],
              text: 'test',
            },
          ],
          markDefs: [
            {
              _key: 'linkdef',
              _type: 'link',
              href: 'https://example.org',
            },
          ],
          style: 'h2',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [
            {
              key: 'span-1',
              marks: [
                {
                  options: {
                    href: 'https://example.org',
                  },
                  type: 'link',
                },
              ],
              text: 'test',
              type: 'span',
            },
          ],
          style: 'h2',
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it('span parsing 4', () => {
      const blocks = [
        {
          _key: '1',
          _type: 'block',
          children: [
            {
              _key: 'span-1',
              _type: 'span',
              marks: ['em', 'linkdef', 'u'],
              text: 'test',
            },
          ],
          markDefs: [
            {
              _key: 'linkdef',
              _type: 'link',
              href: 'https://example.org',
            },
          ],
          style: 'h2',
        },
      ];

      const parsed = parseBlocks(blocks);

      const expected: ExpectedReturn = [
        {
          key: '1',
          kind: 'text',
          spans: [
            {
              key: 'span-1',
              marks: [
                { type: 'em' },
                {
                  options: { href: 'https://example.org' },
                  type: 'link',
                },
                { type: 'u' },
              ],
              text: 'test',
              type: 'span',
            },
          ],
          style: 'h2',
        },
      ];

      expect(parsed).toEqual(expected);
    });

    it.todo('multiple spans with same mark from markdefs');
  });

  describe('chunker', () => {
    it('smoke 1', () => {
      const chunked = groupByLevel([{ level: 1 }] as any);
      expect(chunked).toEqual([{ level: 1 }]);
    });

    it('smoke 2', () => {
      const chunked = groupByLevel([{ level: 1 }, { level: 1 }] as any);
      expect(chunked).toEqual([{ level: 1 }, { level: 1 }]);
    });

    it('smoke 3', () => {
      const chunked = groupByLevel([{ level: 1 }, { level: 2 }] as any);
      expect(chunked).toEqual([{ level: 1 }, [{ level: 2 }]]);
    });

    it('smoke 4', () => {
      const chunked = groupByLevel([
        { level: 1 },
        { level: 2 },
        { level: 1 },
      ] as any);
      expect(chunked).toEqual([{ level: 1 }, [{ level: 2 }], { level: 1 }]);
    });

    it('smoke 4', () => {
      const chunked = groupByLevel([
        { level: 1 },
        { level: 2 },
        { level: 3 },
        { level: 1 },
      ] as any);

      expect(chunked).toEqual([
        { level: 1 },
        [{ level: 2 }, [{ level: 3 }]],
        { level: 1 },
      ]);
    });

    it('smoke 5', () => {
      const chunked = groupByLevel([
        { level: 1 },
        { level: 2 },
        { level: 3 },
        { level: 2 },
        { level: 1 },
      ] as any);

      expect(chunked).toEqual([
        { level: 1 },
        [{ level: 2 }, [{ level: 3 }], { level: 2 }],
        { level: 1 },
      ]);
    });

    it('smoke 6', () => {
      const chunked = groupByLevel([
        { level: 1 },
        { level: 2 },
        { level: 3 },
        { level: 3 },
        { level: 2 },
        { level: 2 },
        { level: 1 },
        { level: 2 },
        { level: 3 },
        { level: 1 },
        { level: 2 },
      ] as any);

      expect(chunked).toEqual([
        { level: 1 },
        [
          { level: 2 },
          [{ level: 3 }, { level: 3 }],
          { level: 2 },
          { level: 2 },
        ],
        { level: 1 },
        [{ level: 2 }, [{ level: 3 }]],
        { level: 1 },
        [{ level: 2 }],
      ]);
    });
  });
});
