'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

describe('eachDeep', () => {
  it('default', () => {
    let circular = { a: { b: { c: {} } } };
    let log = [];
    circular.a.b.c = circular;
    _.eachDeep(
      circular,
      (value, key, path, depth, parent, parentKey, parentPath, parents) => {
        if (_.indexOf(parents.values, value) !== -1) {
          log.push(
            "Circular reference skipped for '" + key + "' at " + parentPath
          );
          return false;
        }
        //do your things
      },
      { track: true }
    );
    expect(log).to.deep.equal(["Circular reference skipped for 'c' at a.b"]);
  });
});

describe('indexate', () => {
  it('leafsOnly', () => {
    let index = _.indexate(
      {
        a: {
          b: {
            c: [1, 2, 3],
            'hello world': {},
          },
        },
      },
      { leafsOnly: true }
    );
    expect(index).to.deep.equal({
      'a.b.c[0]': 1,
      'a.b.c[1]': 2,
      'a.b.c[2]': 3,
      'a.b["hello world"]': {},
    });
  });
});

describe('keysDeep', () => {
  it('default', () => {
    let keys = _.keysDeep({
      a: {
        b: {
          c: [1, 2, 3],
          'hello world': {},
        },
      },
    });
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
  it('leafsOnly', () => {
    let keys = _.keysDeep(
      {
        a: {
          b: {
            c: [1, 2, 3],
            'hello world': {},
          },
        },
      },
      { leafsOnly: true }
    );
    expect(keys).to.deep.equal([
      'a.b.c[0]',
      'a.b.c[1]',
      'a.b.c[2]',
      'a.b["hello world"]',
    ]);
  });
});
