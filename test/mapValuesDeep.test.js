'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { demo, children } = require('./object')();
var { validateIteration, forLodashes } = require('./common.js');

forLodashes(['mapValuesDeep'], (_) => {
  it('defaults', () => {
    let res = _.mapValuesDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx, { method: 'mapValuesDeep' });
      if (!ctx.isLeaf) {
        return Array.isArray(value) ? [] : {};
      }
      if (value instanceof Date) return 'DATE SKIPPED';
      return (value + '').toUpperCase();
    });
    // console.log(JSON.stringify(res));
    expect(res).to.deep.equal({
      a: {
        b: {
          c: {
            d: [
              { i: '0' },
              { i: '1' },
              { i: '2' },
              { i: '3' },
              { i: '4' },
              { i: '5' },
              {
                o: {
                  d: 'DATE SKIPPED',
                  f: 'FUNCTION () {}',
                  skip: { please: { dont: { go: { here: 'SKIP IT' } } } },
                },
              },
            ],
            s: 'HELLO',
          },
          b: 'TRUE',
        },
        n: '12345',
        u: 'UNDEFINED',
      },
      nl: 'NULL',
    });
  });
  it('leavesOnly', () => {
    let res = _.mapValuesDeep(
      demo,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapValuesDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return (value + '').toUpperCase();
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '{"a":{"b":{"c":{"d":[{"i":"0"},{"i":"1"},{"i":"2"},{"i":"3"},{"i":"4"},{"i":"5"},{"o":{"d":"DATE SKIPPED","f":"FUNCTION () {}","skip":{"please":{"dont":{"go":{"here":"SKIP IT"}}}}}}],"s":"HELLO"},"b":"TRUE"},"n":"12345","u":"UNDEFINED"},"nl":"NULL"}'
    );
  });

  it('array', () => {
    let res = _.mapValuesDeep(
      [demo],
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapValuesDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return (value + '').toUpperCase();
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '[{"a":{"b":{"c":{"d":[{"i":"0"},{"i":"1"},{"i":"2"},{"i":"3"},{"i":"4"},{"i":"5"},{"o":{"d":"DATE SKIPPED","f":"FUNCTION () {}","skip":{"please":{"dont":{"go":{"here":"SKIP IT"}}}}}}],"s":"HELLO"},"b":"TRUE"},"n":"12345","u":"UNDEFINED"},"nl":"NULL"}]'
    );
  });

  it('primitive', () => {
    _.each([0, 1, 2, 'a', 'bcd', true, false, null, undefined], (v) => {
      expect(_.mapValuesDeep(v)).to.equal(v);
    });
  });

  it('tree mode', () => {
    let res = _.mapValuesDeep(
      children,
      (v) => ({
        title: v.name.toUpperCase(),
      }),
      { childrenPath: 'children' }
    );
    // console.log(JSON.stringify(res));
    expect(res).to.deep.equal([
      {
        title: 'GRAND 1',
        children: [
          {
            title: 'PARENT 1.1',
            children: [{ title: 'CHILD 1.1.1' }, { title: 'CHILD 1.1.2' }],
          },
          {
            title: 'PARENT 1.2',
            children: [{ title: 'CHILD 1.2.1' }, { title: 'CHILD 1.2.2' }],
          },
        ],
      },
      {
        title: 'GRAND 2',
        children: [
          {
            title: 'PARENT 2.1',
            children: [{ title: 'CHILD 2.1.1' }, { title: 'CHILD 2.1.2' }],
          },
          {
            title: 'PARENT 2.2',
            children: [{ title: 'CHILD 2.2.1' }, { title: 'CHILD 2.2.2' }],
          },
        ],
      },
    ]);
  });

  it('tree mode - rootIsChildren', () => {
    // console.log(children);
    let res = _.mapValuesDeep(
      { g1: children[0], g2: children[1] },
      (v, k, p, c) => {
        return { title: v.name.toUpperCase() };
      },
      { childrenPath: 'children', rootIsChildren: true, includeRoot: false }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).to.equal(
      '{"g1":{"title":"GRAND 1","children":[{"title":"PARENT 1.1","children":[{"title":"CHILD 1.1.1"},{"title":"CHILD 1.1.2"}]},{"title":"PARENT 1.2","children":[{"title":"CHILD 1.2.1"},{"title":"CHILD 1.2.2"}]}]},"g2":{"title":"GRAND 2","children":[{"title":"PARENT 2.1","children":[{"title":"CHILD 2.1.1"},{"title":"CHILD 2.1.2"}]},{"title":"PARENT 2.2","children":[{"title":"CHILD 2.2.1"},{"title":"CHILD 2.2.2"}]}]}}'
    );
  });

  it('switch array to object and dont skip', () => {
    let res = _.mapValuesDeep(
      { a: [0, 1, 2], b: [{ a: 0 }, { b: 1 }, { c: 2 }] },
      (v, k, p, x) => {
        if (!x.isLeaf) {
          x.skipChildren(false);
          return {};
        }
        return v + 1;
      }
    );
    expect(res).to.deep.equal({
      a: { '0': 1, '1': 2, '2': 3 },
      b: { '0': { a: 1 }, '1': { b: 2 }, '2': { c: 3 } },
    });
  });

  it('switch object to array and dont skip', () => {
    let res = _.mapValuesDeep(
      { '0': ['a', 'b', 'c'], '1': [{ 0: 'a' }, { 1: 'b' }, { 2: 'c' }] },
      (v, k, p, x) => {
        if (!x.isLeaf) {
          x.skipChildren(false);
          return [];
        }
        return v + 1;
      }
    );
    expect(res).to.deep.equal([
      ['a1', 'b1', 'c1'],
      [['a1'], [, 'b1'], [, , 'c1']],
    ]);
  });

  it('switch array to object and skip by default', () => {
    let res = _.mapValuesDeep(
      { a: [0, 1, 2], b: [{ a: 0 }, { b: 1 }, { c: 2 }] },
      (v, k, p, x) => {
        if (!x.isLeaf) {
          return { skip: 'skip' };
        }
        return v + 1;
      }
    );
    expect(res).to.deep.equal({
      a: { skip: 'skip' },
      b: { skip: 'skip' },
      skip: 'skip',
    });
  });

  it('switch object to array and skip by default', () => {
    let res = _.mapValuesDeep(
      [
        ['a', 'b', 'c'],
        [{ 0: 'a' }, { 1: 'b' }, { 2: 'c' }],
      ],
      (v, k, p, x) => {
        if (!x.isLeaf) {
          return ['skip'];
        }
        return v + 1;
      }
    );
    expect(res).to.deep.equal([
      ['a1', 'b1', 'c1'],
      [['skip'], ['skip'], ['skip']],
    ]);
  });

  it('switch array to object and force skip', () => {
    let res = _.mapValuesDeep(
      { a: [0, 1, 2], b: [{ a: 0 }, { b: 1 }, { c: 2 }] },
      (v, k, p, x) => {
        if (!x.isLeaf) {
          if (x.depth) {
            x.skipChildren(true);
          }
          return {};
        }
        return v + 1;
      }
    );
    expect(res).to.deep.equal({
      a: {},
      b: {},
    });
  });

  it('switch object to array and force skip', () => {
    let res = _.mapValuesDeep(
      [
        ['a', 'b', 'c'],
        [{ 0: 'a' }, { 1: 'b' }, { 2: 'c' }],
      ],
      (v, k, p, x) => {
        if (!x.isLeaf) {
          if (x.depth) {
            x.skipChildren(true);
          }
          return [];
        }
        return v + 1;
      }
    );
    expect(res).to.deep.equal([[], []]);
  });

  it('switch object to array and force skip', () => {
    let res = _.mapValuesDeep(
      { hello: { from: [{ array: 'object' }] } },
      (v, k, p, x) => {
        return Array.isArray(v) ? { the: v[0] } : {};
      }
    );
    expect(res).to.deep.equal({
      hello: { from: { the: { array: 'object' } } },
    });
  });
});
