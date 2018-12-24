'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect;
// assert = require('assert'),
var _ = require('lodash'),
  deep = require('../deepdash');

const asserttype = require('chai-asserttype');
chai.use(asserttype);
describe('Methods exist already', () => {
  it('check them', () => {
    _ = _.runInContext();
    _.mixin({ eachDeep: () => 'no room!' });
    _ = deep(_);
    expect(_.eachDeep()).to.equal('no room!');

    _ = _.runInContext();
    _.mixin({ forEachDeep: () => 'no room!' });
    _ = deep(_);
    expect(_.forEachDeep()).to.equal('no room!');

    _ = _.runInContext();
    _.mixin({ indexate: () => 'no room!' });
    _ = deep(_);
    expect(_.indexate()).to.equal('no room!');

    _ = _.runInContext();
    _.mixin({ keysDeep: () => 'no room!' });
    _ = deep(_);
    expect(_.keysDeep()).to.equal('no room!');

    _ = _.runInContext();
    _.mixin({ paths: () => 'no room!' });
    _ = deep(_);
    expect(_.paths()).to.equal('no room!');

    _ = _.runInContext();
    _.mixin({ filterDeep: () => 'no room!' });
    _ = deep(_);
    expect(_.filterDeep()).to.equal('no room!');
  });
});
