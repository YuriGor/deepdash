'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular } = require('./object');

describe('indexate', () => {
  it('Count paths', () => {
    let index = _.indexate(demo);
    expect(_.size(index)).equal(30);
  });
  it('Array', () => {
    let index = _.indexate([demo, demo]);
    expect(_.size(index)).equal(62);
  });
  it('Count paths circular', () => {
    let index = _.indexate(circular, { checkCircular: true });
    // console.log(index);
    expect(_.size(index)).equal(23);
    index = _.indexate(circular, {
      checkCircular: true,
      includeCircularPath: false,
    });
    // console.log(index);
    expect(_.size(index)).equal(20);
  });
  it('Chaining', () => {
    let index = _(demo)
      .indexate()
      .value();
    expect(_.size(index)).equal(30);
  });
  it('alias paths', () => {
    let index = _.paths(demo);
    expect(_.size(index)).equal(30);
  });
  it('returns empty array', () => {
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
    let index = _.indexate(demo, { leafsOnly: true });
    expect(_.size(index)).equal(14);
  });

  it('Leafs only circular', () => {
    let index = _.indexate(circular, { checkCircular: true, leafsOnly: true });
    expect(_.size(index)).equal(10);
    index = _.indexate(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leafsOnly: true
    });
    expect(_.size(index)).equal(9);
  });

});
