'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular } = require('./object');

describe('indexate', () => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.indexate(obj, { leavesOnly: true });
    expect(obj).to.deep.equal(orig);
  });
  it('Count paths', () => {
    let index = _.indexate(demo, { leafsOnly: false });
    expect(_.size(index)).equal(30);
  });
  it('Array', () => {
    let index = _.indexate([demo, demo], { leavesOnly: false });
    expect(_.size(index)).equal(62);
  });
  it('Count paths circular', () => {
    let index = _.indexate(circular, {
      checkCircular: true,
      leavesOnly: false,
    });
    // console.log(index);
    expect(_.size(index)).equal(25);
    index = _.indexate(circular, {
      checkCircular: true,
      leavesOnly: false,
      includeCircularPath: false,
    });
    // console.log(index);
    expect(_.size(index)).equal(22);
  });
  it('Chaining', () => {
    let index = _(demo)
      .indexate({ leavesOnly: false })
      .value();
    expect(_.size(index)).equal(30);
  });
  it('returns empty obj', () => {
    let index = _.indexate(1);
    expect(index).to.deep.equal({});

    index = _.indexate('123');
    expect(index).to.deep.equal({});

    index = _.indexate(null);
    expect(index).to.deep.equal({});

    index = _.indexate(undefined);
    expect(index).to.deep.equal({});

    index = _.indexate(() => {});
    expect(index).to.deep.equal({});

    index = _.indexate(new Date());
    expect(index).to.deep.equal({});

    index = _.indexate(/.*/);
    expect(index).to.deep.equal({});
  });

  it('Leafs only', () => {
    let index = _.indexate(demo, { leavesOnly: true });
    expect(_.size(index)).equal(14);
  });

  it('Leafs only circular', () => {
    let index = _.indexate(circular, { checkCircular: true, leavesOnly: true });
    expect(_.size(index)).equal(12);
    index = _.indexate(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leavesOnly: true,
    });
    expect(_.size(index)).equal(9);
  });
  it('empty props', () => {
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    let index = _.indexate(o);
    expect(_.size(index)).equal(2);
    var a = ['a', 'b', 'c'];
    delete a[1];
    index = _.indexate(a);
    expect(_.size(index)).equal(2);
    var slots = ['start', , 'middle', , 'finish'];
    index = _.indexate(slots);
    expect(_.size(index)).equal(3);
  });
});
