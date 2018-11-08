'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular } = require('./object');

describe('paths', () => {
  it('Count paths', () => {
    let paths = _.paths(demo);
    expect(paths.length).equal(30);
  });
  it('Array', () => {
    let paths = _.paths([demo, demo]);
    expect(paths.length).equal(62);
  });
  it('Count paths circular', () => {
    let paths = _.paths(circular, { checkCircular: true });
    // console.log(paths);
    expect(paths.length).equal(23);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
    });
    // console.log(paths);
    expect(paths.length).equal(20);
  });
  it('Chaining', () => {
    let paths = _(demo)
      .paths()
      .value();
    expect(paths.length).equal(30);
  });
  it('alias keysDeep', () => {
    let paths = _.keysDeep(demo);
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
    expect(paths.length).equal(10);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leafsOnly: true
    });
    expect(paths.length).equal(9);
  });

});
