'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

describe('README examples', () => {
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
    _.eachDeep(
      children,
      (child, i, parent, ctx) => {
        // console.log(_.repeat('  ', ctx.depth) + child.name);
        total++;
      },
      { tree: true }
    );
    // console.log('total nodes: ' + total);
    expect(total).equal(14);
  });
  it('indexate', () => {
    let index = _.indexate(
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
    expect(index).to.deep.equal({
      'a.b.c[0]': 1,
      'a.b.c[1]': 2,
      'a.b.c[2]': 3,
      'a.b["hello world"]': {},
    });
  });
  it('keysDeep', () => {
    let keys = _.keysDeep(
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
    expect(keys).to.deep.equal([
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
    filtrate.should.to.deep.equal({
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
      good4: [{ good5: true }],
    });
    clean = _.omitDeep(obj, /^bad.*$/);
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true },
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
      good2: { good3: true, bad3: true },
      bad2: { good: true },
      good4: [{ good5: true, bad5: true }],
    });
    clean = _.pickDeep(obj, /^good.*$/);
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true, bad3: true },
      bad2: { good: true },
      good4: [{ good5: true, bad5: true }],
    });
  });
});
