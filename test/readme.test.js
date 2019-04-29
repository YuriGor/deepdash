'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');

var { forLodashes } = require('./common.js');
forLodashes(
  [
    'eachDeep',
    'index',
    'paths',
    'keysDeep',
    'filterDeep',
    'condense',
    'condenseDeep',
    'exists',
    'omitDeep',
    'pickDeep',
    'omitDeep',
    'mapDeep',
  ],
  (_) => {
    it('usage', () => {
      let obj = {
        a: {
          b: {
            c: {
              d: [
                { i: 0 },
                { i: 1 },
                { i: 2 },
                { i: 3 },
                { i: 4 },
                { i: 5 },
                {
                  o: {
                    d: new Date(),
                    f: function() {},
                    skip: {
                      please: {
                        dont: {
                          go: {
                            here: 'skip it',
                          },
                        },
                      },
                    },
                  },
                },
              ],
              s: 'hello',
            },
            b: true,
          },
          n: 12345,
          u: undefined,
        },
        nl: null,
      };
      _.eachDeep(obj, (value, key, parent, context) => {
        // console.log(
        //   _.repeat('  ', context.depth) +
        //     key +
        //     ':' +
        //     (value === null ? 'null' : typeof value),
        //   context.parent.path && ' @' + context.parent.path
        // );
        if (key == 'skip') {
          return false; // return false explicitly to skip iteration over current value's children
        }
      });
    });
    it('eachDeep', () => {
      let circular = { a: { b: { c: {} } } };
      let log = [];
      circular.a.b.c = circular.a;
      _.eachDeep(
        circular,
        (value, key, parent, ctx) => {
          if (ctx.isCircular) {
            log.push(
              'Circular reference to ' +
                ctx.circularParent.path +
                ' skipped at ' +
                ctx.path
            );
            return false;
          }
          //do your things
        },
        { checkCircular: true }
      );
      expect(log).to.deep.equal(['Circular reference to a skipped at a.b.c']);
    });
    it('eachDeep tree', () => {
      let children = [
        {
          name: 'grand 1',
          children: [
            {
              name: 'parent 1.1',
              children: [{ name: 'child 1.1.1' }, { name: 'child 1.1.2' }],
            },
            {
              name: 'parent 1.2',
              children: [{ name: 'child 1.2.1' }, { name: 'child 1.2.2' }],
            },
          ],
        },
        {
          name: 'grand 2',
          children: [
            {
              name: 'parent 2.1',
              children: [{ name: 'child 2.1.1' }, { name: 'child 2.1.2' }],
            },
            {
              name: 'parent 2.2',
              children: [{ name: 'child 2.2.1' }, { name: 'child 2.2.2' }],
            },
          ],
        },
      ];
      let total = 0;
      let log = [];
      _.eachDeep(
        children,
        (child, i, parent, ctx) => {
          log.push(_.repeat('  ', ctx.depth) + child.name);
          total++;
        },
        { childrenPath: 'children' }
      );
      // console.log(log);
      expect(total).equal(14);
      expect(log).deep.equal([
        '  grand 1',
        '    parent 1.1',
        '      child 1.1.1',
        '      child 1.1.2',
        '    parent 1.2',
        '      child 1.2.1',
        '      child 1.2.2',
        '  grand 2',
        '    parent 2.1',
        '      child 2.1.1',
        '      child 2.1.2',
        '    parent 2.2',
        '      child 2.2.1',
        '      child 2.2.2',
      ]);
    });
    it('index', () => {
      let index = _.index(
        {
          a: {
            b: {
              c: [1, 2, 3],
              'hello world': {},
            },
          },
        },
        { leavesOnly: true }
      );
      //console.log(index);
      expect(index).to.deep.equal({
        'a.b.c[0]': 1,
        'a.b.c[1]': 2,
        'a.b.c[2]': 3,
        'a.b["hello world"]': {},
      });
    });
    it('keysDeep', () => {
      let paths = _.paths(
        {
          a: {
            b: {
              c: [1, 2, 3],
              'hello world': {},
            },
          },
        },
        { leavesOnly: false }
      );
      // console.log(paths);
      expect(paths).to.deep.equal([
        'a',
        'a.b',
        'a.b.c',
        'a.b.c[0]',
        'a.b.c[1]',
        'a.b.c[2]',
        'a.b["hello world"]',
      ]);
    });
    it('keysDeep leavesOnly', () => {
      let keys = _.keysDeep(
        {
          a: {
            b: {
              c: [1, 2, 3],
              'hello world': {},
            },
          },
        },
        { leavesOnly: true }
      );
      expect(keys).to.deep.equal([
        'a.b.c[0]',
        'a.b.c[1]',
        'a.b.c[2]',
        'a.b["hello world"]',
      ]);
    });
    it('filterDeep', () => {
      let things = {
        things: [
          { name: 'something', good: false },
          {
            name: 'another thing',
            good: true,
            children: [
              { name: 'child thing 1', good: false },
              { name: 'child thing 2', good: true },
              { name: 'child thing 3', good: false },
            ],
          },
          {
            name: 'something else',
            good: true,
            subItem: { name: 'sub-item', good: false },
            subItem2: { name: 'sub-item-2', good: true },
          },
        ],
      };
      let filtrate = _.filterDeep(
        things,
        (value, key, parent) => {
          if (key == 'name' && parent.good) return true;
          if (key == 'good' && value == true) return true;
        },
        { leavesOnly: true }
      );
      // console.log(filtrate);
      filtrate.should.deep.equal({
        things: [
          {
            name: 'another thing',
            good: true,
            children: [{ name: 'child thing 2', good: true }],
          },
          {
            name: 'something else',
            good: true,
            subItem2: { name: 'sub-item-2', good: true },
          },
        ],
      });
    });
    it('condense', () => {
      let arr = ['a', 'b', 'c', 'd', 'e'];
      delete arr[1];
      // console.log(arr);
      delete arr[3];
      // console.log(arr);
      _.condense(arr);
      // console.log(arr);
      arr.should.to.deep.equal(['a', 'c', 'e']);
    });
    it('condenseDeep', () => {
      let obj = { arr: ['a', 'b', { c: [1, , 2, , 3] }, 'd', 'e'] };
      delete obj.arr[1];
      // console.log(obj);
      delete obj.arr[3];
      // console.log(obj);
      _.condenseDeep(obj);
      // console.log(obj);
      obj.should.to.deep.equal({ arr: ['a', { c: [1, 2, 3] }, 'e'] });
    });

    it('exists', () => {
      var obj = [, { a: [, 'b'] }];
      expect(_.exists(obj, 0)).to.equal(false);
      expect(_.exists(obj, 1)).to.equal(true);
      expect(_.exists(obj, '[1].a[0]')).to.equal(false);
      expect(_.exists(obj, '[1].a[1]')).to.equal(true);
    });

    it('omitDeep', () => {
      let obj = {
        good1: true,
        bad1: false,
        good2: { good3: true, bad3: false },
        bad2: { good: true },
        good4: [{ good5: true, bad5: false }],
        bad4: [],
      };
      var clean = _.omitDeep(obj, ['bad1', 'bad2', 'bad3', 'bad4', 'bad5']);
      expect(clean).to.deep.equal({
        good1: true,
        good2: { good3: true },
        bad2: { good: true },
        good4: [{ good5: true }],
      });
      clean = _.omitDeep(obj, /\.?bad\d?$/);
      expect(clean).to.deep.equal({
        good1: true,
        good2: { good3: true },
        bad2: { good: true },
        good4: [{ good5: true }],
      });
    });

    it('pickDeep', () => {
      let obj = {
        good1: true,
        bad1: false,
        good2: { good3: true, bad3: true },
        bad2: { good: true },
        good4: [{ good5: true, bad5: true }],
        bad4: [],
      };
      let clean = _.pickDeep(obj, [
        'good1',
        'good2',
        'good3',
        'good',
        'good4',
        'good5',
      ]);
      expect(clean).to.deep.equal({
        good1: true,
        good2: { good3: true },
        bad2: { good: true },
        good4: [{ good5: true }],
      });
      clean = _.pickDeep(obj, /\.?good\d?$/);
      expect(clean).to.deep.equal({
        good1: true,
        good2: { good3: true },
        bad2: { good: true },
        good4: [{ good5: true }],
      });
    });
    it('usage', () => {
      let children = [
        {
          description: 'description for node 1',
          comment: 'comment for node 1',
          note: 'note for node 1',
          name: 'node 1',
          bad: false,
          children: [
            {
              description: 'description for node 1.1',
              comment: 'comment for node 1.1',
              note: 'note for node 1.1',
              name: 'node 1.1',
              bad: false,
            },
            {
              description: 'description for node 1.2',
              comment: 'comment for node 1.2',
              note: 'note for node 1.2',
              name: 'node 1.2',
              good: true,
            },
            {
              description: 'description for node 1.3',
              comment: 'comment for node 1.3',
              note: 'note for node 1.3',
              name: 'node 1.3',
              bad: true,
              good: false,
            },
          ],
        },
        {
          description: 'description for node 2',
          comment: 'comment for node 2',
          note: 'note for node 2',
          name: 'node 2',
          good: true,
          children: [
            {
              description: 'description for node 2.1',
              comment: 'comment for node 2.1',
              note: 'note for node 2.1',
              name: 'node 2.1',
              bad: false,
            },
            {
              description: 'description for node 2.2',
              comment: 'comment for node 2.2',
              note: 'note for node 2.2',
              name: 'node 2.2',
              good: true,
            },
            {
              description: 'description for node 2.3',
              comment: 'comment for node 2.3',
              note: 'note for node 2.3',
              name: 'node 2.3',
              bad: true,
              good: false,
            },
          ],
        },
        {
          description: 'description for node 3',
          comment: 'comment for node 3',
          note: 'note for node 3',
          name: 'node 3',
          bad: true,
          good: false,
          children: [
            {
              description: 'description for node 3.1',
              comment: 'comment for node 3.1',
              note: 'note for node 3.1',
              name: 'node 3.1',
              bad: false,
            },
            {
              description: 'description for node 3.2',
              comment: 'comment for node 3.2',
              note: 'note for node 3.2',
              name: 'node 3.2',
              good: true,
            },
            {
              description: 'description for node 3.3',
              comment: 'comment for node 3.3',
              note: 'note for node 3.3',
              name: 'node 3.3',
              bad: true,
              good: false,
            },
          ],
        },
      ];
      let out;
      function displayField(val, key, parent, context) {
        if (_.isArray(parent)) {
          key = '[' + key + ']';
        }
        // console.log(
        out.push(
          _.repeat('   ', context.depth - 1) +
            '→ ' +
            key +
            ': ' +
            (_.isArray(val)
              ? '[' + val.length + ']'
              : _.isObject(val)
              ? '{' + (val.name || '') + '}'
              : val)
        );
      }

      // console.log('\n = Iterate over tree (each child object) = \n');
      out = [];
      _.eachDeep(children, displayField, { childrenPath: 'children' });
      expect(out).to.deep.equal([
        '→ [0]: {node 1}',
        '   → 0: {node 1.1}',
        '   → 1: {node 1.2}',
        '   → 2: {node 1.3}',
        '→ [1]: {node 2}',
        '   → 0: {node 2.1}',
        '   → 1: {node 2.2}',
        '   → 2: {node 2.3}',
        '→ [2]: {node 3}',
        '   → 0: {node 3.1}',
        '   → 1: {node 3.2}',
        '   → 2: {node 3.3}',
      ]);

      // console.log('\n = Iterate over object (each field) = \n');
      out = [];
      _.eachDeep(children, displayField);
      expect(out).to.deep.equal([
        '→ [0]: {node 1}',
        '   → description: description for node 1',
        '   → comment: comment for node 1',
        '   → note: note for node 1',
        '   → name: node 1',
        '   → bad: false',
        '   → children: [3]',
        '      → [0]: {node 1.1}',
        '         → description: description for node 1.1',
        '         → comment: comment for node 1.1',
        '         → note: note for node 1.1',
        '         → name: node 1.1',
        '         → bad: false',
        '      → [1]: {node 1.2}',
        '         → description: description for node 1.2',
        '         → comment: comment for node 1.2',
        '         → note: note for node 1.2',
        '         → name: node 1.2',
        '         → good: true',
        '      → [2]: {node 1.3}',
        '         → description: description for node 1.3',
        '         → comment: comment for node 1.3',
        '         → note: note for node 1.3',
        '         → name: node 1.3',
        '         → bad: true',
        '         → good: false',
        '→ [1]: {node 2}',
        '   → description: description for node 2',
        '   → comment: comment for node 2',
        '   → note: note for node 2',
        '   → name: node 2',
        '   → good: true',
        '   → children: [3]',
        '      → [0]: {node 2.1}',
        '         → description: description for node 2.1',
        '         → comment: comment for node 2.1',
        '         → note: note for node 2.1',
        '         → name: node 2.1',
        '         → bad: false',
        '      → [1]: {node 2.2}',
        '         → description: description for node 2.2',
        '         → comment: comment for node 2.2',
        '         → note: note for node 2.2',
        '         → name: node 2.2',
        '         → good: true',
        '      → [2]: {node 2.3}',
        '         → description: description for node 2.3',
        '         → comment: comment for node 2.3',
        '         → note: note for node 2.3',
        '         → name: node 2.3',
        '         → bad: true',
        '         → good: false',
        '→ [2]: {node 3}',
        '   → description: description for node 3',
        '   → comment: comment for node 3',
        '   → note: note for node 3',
        '   → name: node 3',
        '   → bad: true',
        '   → good: false',
        '   → children: [3]',
        '      → [0]: {node 3.1}',
        '         → description: description for node 3.1',
        '         → comment: comment for node 3.1',
        '         → note: note for node 3.1',
        '         → name: node 3.1',
        '         → bad: false',
        '      → [1]: {node 3.2}',
        '         → description: description for node 3.2',
        '         → comment: comment for node 3.2',
        '         → note: note for node 3.2',
        '         → name: node 3.2',
        '         → good: true',
        '      → [2]: {node 3.3}',
        '         → description: description for node 3.3',
        '         → comment: comment for node 3.3',
        '         → note: note for node 3.3',
        '         → name: node 3.3',
        '         → bad: true',
        '         → good: false',
      ]);

      // console.log('\n = Filter tree (good children) = \n');

      // console.log(
      //   JSON.stringify(_.filterDeep(children, 'good', { childrenPath: 'children' }), null, 2)
      // );
      expect(
        _.filterDeep(children, 'good', { childrenPath: 'children' })
      ).to.deep.equal([
        {
          description: 'description for node 1',
          comment: 'comment for node 1',
          note: 'note for node 1',
          name: 'node 1',
          bad: false,
          children: [
            {
              description: 'description for node 1.2',
              comment: 'comment for node 1.2',
              note: 'note for node 1.2',
              name: 'node 1.2',
              good: true,
            },
          ],
        },
        {
          description: 'description for node 2',
          comment: 'comment for node 2',
          note: 'note for node 2',
          name: 'node 2',
          good: true,
          children: [
            {
              description: 'description for node 2.2',
              comment: 'comment for node 2.2',
              note: 'note for node 2.2',
              name: 'node 2.2',
              good: true,
            },
          ],
        },
        {
          description: 'description for node 3',
          comment: 'comment for node 3',
          note: 'note for node 3',
          name: 'node 3',
          bad: true,
          good: false,
          children: [
            {
              description: 'description for node 3.2',
              comment: 'comment for node 3.2',
              note: 'note for node 3.2',
              name: 'node 3.2',
              good: true,
            },
          ],
        },
      ]);

      // console.log('\n = Filter object (names of good children) = \n');

      // console.log(
      //   JSON.stringify(
      //     _.filterDeep(children, (val, key, parent) => {
      //       if (key == 'name' && parent.good) return true;
      //     }),
      //     null,
      //     2
      //   )
      // );

      expect(
        _.filterDeep(children, (val, key, parent) => {
          if (key == 'name' && parent.good) return true;
        })
      ).to.deep.equal([
        {
          children: [
            {
              name: 'node 1.2',
            },
          ],
        },
        {
          name: 'node 2',
          children: [
            {
              name: 'node 2.2',
            },
          ],
        },
        {
          children: [
            {
              name: 'node 3.2',
            },
          ],
        },
      ]);

      let badChildren = [
        {
          name: '1',
          bad: false,
          children: [
            { name: '1.1', bad: false },
            { name: '1.2' },
            { name: '1.3', bad: true },
          ],
        },
        {
          name: '2',
          children: [
            { name: '2.1', bad: false },
            { name: '2.2' },
            { name: '2.3', bad: true },
          ],
        },
        {
          name: '3',
          bad: true,
          children: [
            { name: '3.1', bad: false },
            { name: '3.2' },
            { name: '3.3', bad: true },
          ],
        },
      ];

      let reallyBad = _.filterDeep(badChildren, 'bad', {
        childrenPath: 'children',
      });
      // console.log(JSON.stringify(reallyBad, null, 2));
      expect(reallyBad).to.deep.equal([
        {
          name: '1',
          bad: false,
          children: [
            {
              name: '1.3',
              bad: true,
            },
          ],
        },
        {
          name: '2',
          children: [
            {
              name: '2.3',
              bad: true,
            },
          ],
        },
        {
          name: '3',
          bad: true,
          children: [
            {
              name: '3.3',
              bad: true,
            },
          ],
        },
      ]);

      // console.log('\n = Pick name and description only = \n');

      // console.log(
      //   JSON.stringify(_.pickDeep(children, ['name', 'description']), null, 2)
      // );

      expect(_.pickDeep(children, ['name', 'description'])).to.deep.equal([
        {
          description: 'description for node 1',
          name: 'node 1',
          children: [
            {
              description: 'description for node 1.1',
              name: 'node 1.1',
            },
            {
              description: 'description for node 1.2',
              name: 'node 1.2',
            },
            {
              description: 'description for node 1.3',
              name: 'node 1.3',
            },
          ],
        },
        {
          description: 'description for node 2',
          name: 'node 2',
          children: [
            {
              description: 'description for node 2.1',
              name: 'node 2.1',
            },
            {
              description: 'description for node 2.2',
              name: 'node 2.2',
            },
            {
              description: 'description for node 2.3',
              name: 'node 2.3',
            },
          ],
        },
        {
          description: 'description for node 3',
          name: 'node 3',
          children: [
            {
              description: 'description for node 3.1',
              name: 'node 3.1',
            },
            {
              description: 'description for node 3.2',
              name: 'node 3.2',
            },
            {
              description: 'description for node 3.3',
              name: 'node 3.3',
            },
          ],
        },
      ]);

      // console.log('\n = Omit paths not ending with "e" = \n');

      // console.log(
      //   JSON.stringify(
      //     _.omitDeep(children, /[^e]$/i, { onMatch: { skipChildren: false } }),
      //     null,
      //     2
      //   )
      // );

      expect(
        _.omitDeep(children, /[^e]$/i, { onMatch: { skipChildren: false } })
      ).to.deep.equal([
        {
          note: 'note for node 1',
          name: 'node 1',
          children: [
            {
              note: 'note for node 1.1',
              name: 'node 1.1',
            },
            {
              note: 'note for node 1.2',
              name: 'node 1.2',
            },
            {
              note: 'note for node 1.3',
              name: 'node 1.3',
            },
          ],
        },
        {
          note: 'note for node 2',
          name: 'node 2',
          children: [
            {
              note: 'note for node 2.1',
              name: 'node 2.1',
            },
            {
              note: 'note for node 2.2',
              name: 'node 2.2',
            },
            {
              note: 'note for node 2.3',
              name: 'node 2.3',
            },
          ],
        },
        {
          note: 'note for node 3',
          name: 'node 3',
          children: [
            {
              note: 'note for node 3.1',
              name: 'node 3.1',
            },
            {
              note: 'note for node 3.2',
              name: 'node 3.2',
            },
            {
              note: 'note for node 3.3',
              name: 'node 3.3',
            },
          ],
        },
      ]);
      expect(
        _.mapDeep(
          { hello: { from: { the: 'deep word' } } },
          (v) => v.toUpperCase(),
          { leavesOnly: true }
        )
      ).to.deep.equal({ hello: { from: { the: 'DEEP WORD' } } });
    });
  }
);
