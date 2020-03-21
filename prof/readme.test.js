'use strict';

var { forLodashes, it, expect } = require('./common.js');
forLodashes(
  [
    'eachDeep',
    'index',
    'paths',
    'keysDeep',
    'filterDeep',
    'findDeep',
    'condense',
    'condenseDeep',
    'exists',
    'omitDeep',
    'pickDeep',
    'omitDeep',
    'mapValuesDeep',
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
        //   context.parent && context.parent.path && ' @' + context.parent.path
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
      expect(log);
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
      expect(total);
      expect(log);
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
      expect(index);
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
      expect(paths);
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
      expect(keys);
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
      filtrate.should;
    });
    it('condense', () => {
      let arr = ['a', 'b', 'c', 'd', 'e'];
      delete arr[1];
      // console.log(arr);
      delete arr[3];
      // console.log(arr);
      _.condense(arr);
      // console.log(arr);
      arr.should;
    });
    it('condenseDeep', () => {
      let obj = { arr: ['a', 'b', { c: [1, , 2, , 3] }, 'd', 'e'] };
      delete obj.arr[1];
      // console.log(obj);
      delete obj.arr[3];
      // console.log(obj);
      _.condenseDeep(obj);
      // console.log(obj);
      obj.should;
    });

    it('exists', () => {
      var obj = [, { a: [, 'b'] }];
      expect(_.exists(obj, 0));
      expect(_.exists(obj, 1));
      expect(_.exists(obj, '[1].a[0]'));
      expect(_.exists(obj, '[1].a[1]'));
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
      expect(clean);
      clean = _.omitDeep(obj, /\.?bad\d?$/);
      expect(clean);
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
      expect(clean);
      clean = _.pickDeep(obj, /\.?good\d?$/);
      expect(clean);
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
      expect(out);

      // console.log('\n = Iterate over object (each field) = \n');
      out = [];
      _.eachDeep(children, displayField);
      expect(out);

      // console.log('\n = Filter tree (good children) = \n');

      // console.log(
      //   JSON.stringify(_.filterDeep(children, 'good', { childrenPath: 'children' }), null, 2)
      // );
      expect(_.filterDeep(children, 'good', { childrenPath: 'children' }));

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
      );

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
      expect(reallyBad);

      // console.log('\n = Pick name and description only = \n');

      // console.log(
      //   JSON.stringify(_.pickDeep(children, ['name', 'description']), null, 2)
      // );

      expect(_.pickDeep(children, ['name', 'description']));

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
      );
      expect(
        _.mapValuesDeep({ hello: { from: { the: 'deep word' } } }, (v) => v)
      );
    });
  }
);
