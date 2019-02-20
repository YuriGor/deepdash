'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

describe('README examples', () => {
  it('eachDeep', () => {
    let circular = { a: { b: { c: {} } } };
    let log = [];
    circular.a.b.c = circular;
    _.eachDeep(circular, (value, key, parent, ctx) => {
      if (_.findIndex(ctx.parents, ['value', value]) !== -1) {
        log.push(
          "Circular reference skipped for '" + key + "' at " + ctx.parent.path
        );
        return false;
      }
      //do your things
    });
    expect(log).to.deep.equal(["Circular reference skipped for 'c' at a.b"]);
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
});
