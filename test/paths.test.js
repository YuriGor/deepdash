'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular, children } = require('./object');

describe('paths', () => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.paths(obj, { leavesOnly: true });
    expect(obj).to.deep.equal(orig);
  });
  it('Count paths', () => {
    let paths = _.paths(demo, { leavesOnly: false });
    expect(paths.length).equal(30);
  });
  it('Array', () => {
    let paths = _.paths([demo, demo], { leafsOnly: false });
    expect(paths.length).equal(62);
  });
  it('Count paths circular', () => {
    let paths = _.paths(circular, { checkCircular: true, leavesOnly: false });
    // console.log(paths);
    expect(paths.length).equal(25);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leavesOnly: false,
    });
    // console.log(paths);
    expect(paths.length).equal(22);
  });
  it('Chaining', () => {
    let paths = _(demo)
      .paths({ leavesOnly: false })
      .value();
    expect(paths.length).equal(30);
  });
  it('alias keysDeep', () => {
    let paths = _.keysDeep(demo, { leavesOnly: false });
    expect(paths.length).equal(30);
  });
  it('returns empty array', () => {
    let paths = _.paths(1);
    expect(paths)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    paths = _.paths('123');
    expect(paths)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    paths = _.paths(null);
    expect(paths)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    paths = _.paths(undefined);
    expect(paths)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    paths = _.paths(() => {});
    expect(paths)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    paths = _.paths(new Date());
    expect(paths)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    paths = _.paths(/.*/);
    expect(paths)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
  });

  it('Leafs only', () => {
    let paths = _.paths(demo, { leavesOnly: true });
    expect(paths.length).equal(14);
  });

  it('Leafs only circular', () => {
    let paths = _.paths(circular, { checkCircular: true, leavesOnly: true });
    expect(paths.length).equal(12);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leavesOnly: true,
    });
    expect(paths.length).equal(9);
  });
  it('empty props', () => {
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    let paths = _.paths(o);
    expect(paths.length).equal(2);
    var a = ['a', 'b', 'c'];
    delete a[1];
    paths = _.paths(a);
    expect(paths.length).equal(2);
    var slots = ['start', , 'middle', , 'finish'];
    paths = _.paths(slots);
    expect(paths.length).equal(3);
  });
  it('dangerous field names', () => {
    let obj = {
      '': '[""]',
      "'": '["\'"]',
      '"': '["\\""]',
      '[': '["["]',
      ']': '["]"]',
      '.': '["."]',
      '["."]"\'.': '["[\\".\\"]\\"\'."]',
      '["."]"\'..': {
        '["."]"\'.': '["[\\".\\"]\\"\'.."]["[\\".\\"]\\"\'."]',
      },
      '["."]"\'...': [
        {
          '["."]"\'.': '["[\\".\\"]\\"\'..."][0]["[\\".\\"]\\"\'."]',
        },
      ],
    };
    _(obj)
      .index()
      .each((v, k) => {
        expect(k).to.equal(v);
        expect(_.get(obj, k)).to.equal(v);
      });
  });
  it('array paths format', () => {
    var paths = _.paths(demo, { pathFormat: 'array' });
    expect(paths).to.deep.equal([
      ['a', 'b', 'c', 'd', '0', 'i'],
      ['a', 'b', 'c', 'd', '1', 'i'],
      ['a', 'b', 'c', 'd', '2', 'i'],
      ['a', 'b', 'c', 'd', '3', 'i'],
      ['a', 'b', 'c', 'd', '4', 'i'],
      ['a', 'b', 'c', 'd', '5', 'i'],
      ['a', 'b', 'c', 'd', '6', 'o', 'd'],
      ['a', 'b', 'c', 'd', '6', 'o', 'f'],
      ['a', 'b', 'c', 'd', '6', 'o', 'skip', 'please', 'dont', 'go', 'here'],
      ['a', 'b', 'c', 's'],
      ['a', 'b', 'b'],
      ['a', 'n'],
      ['a', 'u'],
      ['nl'],
    ]);
  });

  it('No leavesOnly in tree', () => {
    try {
      _.paths(children, { tree: true, leavesOnly: true });
    } catch (exc) {
      expect(exc.message).equal(
        '"leavesOnly" option cannot be true in the "tree" mode.'
      );
    }
  });
  it('paths of tree', () => {
    let paths = _.paths(children, { tree: true });

    // console.log(paths);
    expect(paths).to.deep.equal([
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
      '[1].children[0].children[1]',
      '[1].children[1]',
      '[1].children[1].children[0]',
      '[1].children[1].children[1]',
    ]);
  });
});
