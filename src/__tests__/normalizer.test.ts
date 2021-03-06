import { normalize, groupByLevel, NormalizedPortableText } from '../normalizer';
import { PortableText, parse } from '../parser';

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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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
      const parsed = normalize([]);

      const expected: NormalizedPortableText = [];

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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

      const parsed = normalize(parse(blocks));

      const expected: NormalizedPortableText = [
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

  it('can parse some real pote', () => {
    const raw = [
      {
        _key: '08b36691aa6c',
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
        _key: 'fafa4778d2cf',
        _type: 'block',
        children: [
          {
            _key: 'c513b0857a150',
            _type: 'span',
            marks: [],
            text: '',
          },
        ],
        markDefs: [
          {
            _key: '07255f9a8e82',
            _type: 'link',
            href: 'https://example.org',
          },
          {
            _key: 'c2586df86f96',
            _type: 'link',
            href: 'http://example.org/standard',
          },
        ],
        style: 'normal',
      },
      {
        _key: '2fcec9282a26',
        _type: 'block',
        children: [
          {
            _key: 'a89f4c1fb094',
            _type: 'span',
            marks: [],
            text: 'First level',
          },
        ],
        level: 1,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: 'b2c09f20b5fc',
        _type: 'block',
        children: [
          {
            _key: '035c2da0f61b',
            _type: 'span',
            marks: [],
            text: 'Second Level',
          },
        ],
        level: 2,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '53887cc397ad',
        _type: 'block',
        children: [
          {
            _key: '801ccc966c00',
            _type: 'span',
            marks: [],
            text: 'Third level',
          },
        ],
        level: 3,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: 'ca379218c82e',
        _type: 'block',
        children: [
          {
            _key: 'a35b3d1f5954',
            _type: 'span',
            marks: [],
            text: 'boops',
          },
        ],
        level: 3,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: 'a93bfb7b0421',
        _type: 'block',
        children: [
          {
            _key: 'a0a8aee84d71',
            _type: 'span',
            marks: [],
            text: 'Second again',
          },
        ],
        level: 2,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: 'bb9e87d4e23f',
        _type: 'block',
        children: [
          {
            _key: '929ac4db7ba2',
            _type: 'span',
            marks: [],
            text: 'Back to first',
          },
        ],
        level: 1,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '71d4880ed416',
        _type: 'block',
        children: [
          {
            _key: 'cfdc0ff320f4',
            _type: 'span',
            marks: [],
            text: 'First',
          },
        ],
        level: 1,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '00ba2a27ea22',
        _type: 'block',
        children: [
          {
            _key: 'a09f03cad75e',
            _type: 'span',
            marks: [],
            text: 'Second again',
          },
        ],
        level: 2,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '954a39f6396a',
        _type: 'block',
        children: [
          {
            _key: '7e89e7de7846',
            _type: 'span',
            marks: [],
            text: '',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '52579d5e81c0',
        _type: 'block',
        children: [
          {
            _key: 'ef03e2113752',
            _type: 'span',
            marks: [],
            text: 'Another list after first.',
          },
        ],
        level: 1,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '8a3d097cadf0',
        _type: 'block',
        children: [
          {
            _key: '641f639f9769',
            _type: 'span',
            marks: [],
            text: 'boopsy',
          },
        ],
        level: 1,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '6466b0e7520b',
        _type: 'block',
        children: [
          {
            _key: '36225a073fa7',
            _type: 'span',
            marks: ['strong'],
            text: 'Lorem Ipsum',
          },
          {
            _key: 'c513b0857a151',
            _type: 'span',
            marks: [],
            text: ' is ',
          },
          {
            _key: '7dc7715880e8',
            _type: 'span',
            marks: ['strong'],
            text: 'simply',
          },
          {
            _key: 'b693cca40d33',
            _type: 'span',
            marks: [],
            text: ' ',
          },
          {
            _key: '8c8b30019b14',
            _type: 'span',
            marks: ['07255f9a8e82'],
            text: 'dummy',
          },
          {
            _key: '03efc06bb289',
            _type: 'span',
            marks: [],
            text: ' ',
          },
          {
            _key: '6bc2e94fd1d0',
            _type: 'span',
            marks: ['em'],
            text: 'text',
          },
          {
            _key: 'f24c53c7d861',
            _type: 'span',
            marks: [],
            text: ' of the printing and typesetting industry. Lorem Ipsum has been the ',
          },
          {
            _key: '26dd433698a4',
            _type: 'span',
            marks: ['strong'],
            text: "industry's ",
          },
          {
            _key: '432ab17c670d',
            _type: 'span',
            marks: ['strong', 'c2586df86f96'],
            text: 'standard',
          },
          {
            _key: '061f2f58c404',
            _type: 'span',
            marks: ['strong'],
            text: ' dummy text',
          },
          {
            _key: 'c1be88c6c3c8',
            _type: 'span',
            marks: [],
            text: ' ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of ',
          },
          {
            _key: '38376c2e9d32',
            _type: 'span',
            marks: ['em'],
            text: 'Letraset',
          },
          {
            _key: '0f3b9246a814',
            _type: 'span',
            marks: [],
            text: ' sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
          },
        ],
        markDefs: [
          {
            _key: '07255f9a8e82',
            _type: 'link',
            href: 'https://example.org',
          },
          {
            _key: 'c2586df86f96',
            _type: 'link',
            href: 'http://example.org/standard',
          },
        ],
        style: 'normal',
      },
      {
        _key: '461abbd2c0fa',
        _type: 'block',
        children: [
          {
            _key: '09dae497a67f',
            _type: 'span',
            marks: [],
            text: 'Quoted text is here',
          },
        ],
        markDefs: [],
        style: 'blockquote',
      },
      {
        _key: '46b3264f5aaa',
        _type: 'block',
        children: [
          {
            _key: 'd16afbba501c',
            _type: 'span',
            marks: [],
            text: 'Bukket list!',
          },
        ],
        level: 1,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: 'e64fe4340412',
        _type: 'block',
        children: [
          {
            _key: '8b4da389d614',
            _type: 'span',
            marks: [],
            text: 'Bukket kust',
          },
        ],
        level: 1,
        listItem: 'bullet',
        markDefs: [],
        style: 'normal',
      },
      {
        _key: 'cc3833c960e0',
        _type: 'block',
        children: [
          {
            _key: '9b9e60f72e9e',
            _type: 'span',
            marks: [],
            text: '',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '9a92bde85887',
        _type: 'image',
        asset: {
          _ref: 'image-b65b683bb431e47cc5d372896bbe42a2bb8e6d52-480x320-jpg',
          _type: 'reference',
        },
      },
      {
        _key: 'f64ddf1955da',
        _type: 'block',
        children: [
          {
            _key: '461c4603e3c90',
            _type: 'span',
            marks: [],
            text: 'Why do we use it?',
          },
        ],
        markDefs: [],
        style: 'h2',
      },
      {
        _key: '42d7b2be25ec',
        _type: 'block',
        children: [
          {
            _key: '9ce260822d790',
            _type: 'span',
            marks: [],
            text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '848a4f528d77',
        _type: 'block',
        children: [
          {
            _key: '4c22d31ad53b0',
            _type: 'span',
            marks: [],
            text: '\nH3 title',
          },
        ],
        markDefs: [],
        style: 'h3',
      },
      {
        _key: '43ce251095d2',
        _type: 'block',
        children: [
          {
            _key: '17460ce15d06',
            _type: 'span',
            marks: [],
            text: 'H2 title',
          },
        ],
        markDefs: [],
        style: 'h2',
      },
      {
        _key: 'bf832d7c5060',
        _type: 'block',
        children: [
          {
            _key: '62268bec5438',
            _type: 'span',
            marks: [],
            text: '',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '23db6f0be6c0',
        _type: 'block',
        children: [
          {
            _key: '64888911da0e0',
            _type: 'span',
            marks: [],
            text: 'Where does it come from?',
          },
        ],
        markDefs: [],
        style: 'h2',
      },
      {
        _key: '069bdc2d96cd',
        _type: 'block',
        children: [
          {
            _key: '258217b6c54d0',
            _type: 'span',
            marks: [],
            text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '200302244fc7',
        _type: 'block',
        children: [
          {
            _key: 'b7d53b1e17b60',
            _type: 'span',
            marks: [],
            text: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _key: '1097440f0289',
        _type: 'block',
        children: [
          {
            _key: '5ee320ec02030',
            _type: 'span',
            marks: [],
            text: 'Where can I get some?',
          },
        ],
        markDefs: [],
        style: 'h2',
      },
      {
        _key: '4ba31b127df4',
        _type: 'block',
        children: [
          {
            _key: '8ad2349bc58a0',
            _type: 'span',
            marks: [],
            text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ];

    expect(normalize(parse(raw))).toMatchSnapshot();
  });
});
