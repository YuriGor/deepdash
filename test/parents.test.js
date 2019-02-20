'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
var { demo } = require('./object');

describe('Parents', () => {
  it('Count nodes', () => {
    _.eachDeep(demo, (value, key, parent, ctx) => {
      // console.log('path:', ctx.path);
      // console.log('parent:', parent);
      // console.log('ctx.parent:', ctx.parent);
      // console.log('parents:', ctx.parents);
      // console.log('-----------');
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
