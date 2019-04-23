'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../dist/cjs/deepdash')(require('lodash'));
var { demo } = require('./object');

var { forLodashes } = require('./common.js');
forLodashes(['eachDeep'], (_) => {
  it('Count nodes', () => {
    _.eachDeep(demo, (value, key, parent, ctx) => {
      // console.log('path:', ctx.path);
      // console.log('parent:', parent);
      // console.log('ctx.parent:', ctx.parent);
      // console.log('parents:', ctx.parents);
      // console.log('-----------');
      if (ctx.parent === undefined) return;
      expect(parent).equal(ctx.parent.value);
      expect(ctx.parent).equal(_.last(ctx.parents));
      _.each(ctx.parents, (p, i) => {
        if (i) {
          expect(p.parent).equal(ctx.parents[i - 1]);
        }
      });
    });
  });
});
