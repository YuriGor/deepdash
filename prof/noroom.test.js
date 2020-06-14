'use strict';

// assert = require('assert'),
var _ = require('lodash').runInContext(),
  deep = require('../deepdash');
var { it, expect } = require('./common.js');

var hrstart = process.hrtime();
it('check them', () => {
  _ = _.runInContext();
  _.mixin({ eachDeep: () => 'no room!' });
  _ = deep(_);
  expect(_.eachDeep());

  _ = _.runInContext();
  _.mixin({ forEachDeep: () => 'no room!' });
  _ = deep(_);
  expect(_.forEachDeep());

  _ = _.runInContext();
  _.mixin({ index: () => 'no room!' });
  _ = deep(_);
  expect(_.index());

  _ = _.runInContext();
  _.mixin({ keysDeep: () => 'no room!' });
  _ = deep(_);
  expect(_.keysDeep());

  _ = _.runInContext();
  _.mixin({ paths: () => 'no room!' });
  _ = deep(_);
  expect(_.paths());

  _ = _.runInContext();
  _.mixin({ filterDeep: () => 'no room!' });
  _ = deep(_);
  expect(_.filterDeep());
});
const hrend = process.hrtime(hrstart);
console.info('✓ %ds %dms', hrend[0], hrend[1] / 1000000);
