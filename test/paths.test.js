'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular } = require('./object');

describe('paths', () => {
  it('Count paths', () => {
    let paths = _.paths(demo, { leafsOnly: false });
    expect(paths.length).equal(30);
  });
  it('Array', () => {
    let paths = _.paths([demo, demo], { leafsOnly: false });
    expect(paths.length).equal(62);
  });
  it('Count paths circular', () => {
    let paths = _.paths(circular, { checkCircular: true, leafsOnly: false });
    // console.log(paths);
    expect(paths.length).equal(25);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leafsOnly: false,
    });
    // console.log(paths);
    expect(paths.length).equal(22);
  });
  it('Chaining', () => {
    let paths = _(demo)
      .paths({ leafsOnly: false })
      .value();
    expect(paths.length).equal(30);
  });
  it('alias keysDeep', () => {
    let paths = _.keysDeep(demo, { leafsOnly: false });
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
    let paths = _.paths(demo, { leafsOnly: true });
    expect(paths.length).equal(14);
  });

  it('Leafs only circular', () => {
    let paths = _.paths(circular, { checkCircular: true, leafsOnly: true });
    expect(paths.length).equal(12);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leafsOnly: true,
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
      .indexate()
      .each((v, k) => {
        expect(k).to.equal(v);
        expect(_.get(obj, k)).to.equal(v);
      });
  });
});
