'use strict';

var { demo } = require('./object')();

var { forLodashes, it, expect } = require('./common.js');
var hrstart = process.hrtime();
forLodashes(['eachDeep'], (_) => {
  it('Count nodes', () => {
    _.eachDeep(demo, (value, key, parent, ctx) => {
      // console.log('path:', ctx.path);
      // console.log('parent:', parent);
      // console.log('ctx.parent:', ctx.parent);
      // console.log('parents:', ctx.parents);
      // console.log('-----------');
      if (ctx.parent === undefined) return;
      expect(parent);
      expect(ctx.parent);
      _.each(ctx.parents, (p, i) => {
        if (i) {
          expect(p.parent);
        }
      });
    });
  });
});
const hrend = process.hrtime(hrstart);
console.info('✓ %ds %dms', hrend[0], hrend[1] / 1000000);
