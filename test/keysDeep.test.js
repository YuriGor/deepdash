'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular } = require('./object');

describe('keysDeep', () => {
  it('Count paths', () => {
    let keys = _.keysDeep(demo);
    expect(keys.length).equal(30);
  });
  it('Array', () => {
    let keys = _.keysDeep([demo, demo]);
    expect(keys.length).equal(62);
  });
  it('Count paths circular', () => {
    let keys = _.keysDeep(circular, { checkCircular: true });
    // console.log(keys);
    expect(keys.length).equal(23);
    keys = _.keysDeep(circular, {
      checkCircular: true,
      includeCircularPath: false,
    });
    // console.log(keys);
    expect(keys.length).equal(20);
  });
  it('Chaining', () => {
    let keys = _(demo)
      .keysDeep()
      .value();
    expect(keys.length).equal(30);
  });
  it('alias paths', () => {
    let keys = _.paths(demo);
    expect(keys.length).equal(30);
  });
  it('returns empty array', () => {
    let keys = _.keysDeep(1);
    expect(keys)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    keys = _.keysDeep('123');
    expect(keys)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    keys = _.keysDeep(null);
    expect(keys)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    keys = _.keysDeep(undefined);
    expect(keys)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    keys = _.keysDeep(() => {});
    expect(keys)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    keys = _.keysDeep(new Date());
    expect(keys)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
    keys = _.keysDeep(/.*/);
    expect(keys)
      .to.be.array()
      .and.has.property('length')
      .equal(0);
  });

  it('Leafs only', () => {
    let keys = _.keysDeep(demo, { leafsOnly: true });
    expect(keys.length).equal(14);
  });

  it('Leafs only circular', () => {
    let keys = _.keysDeep(circular, { checkCircular: true, leafsOnly: true });
    expect(keys.length).equal(10);
    keys = _.keysDeep(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leafsOnly: true
    });
    expect(keys.length).equal(9);
  });

});
