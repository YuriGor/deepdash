'use strict';

var { forLodashes, it, expect } = require('./common.js');
var hrstart = process.hrtime();
forLodashes(['index'], (_) => {
  it('[.]\'"', () => {
    let o = { a: { '[': 'c', '"\'': 'd', '.': 'e' } };

    expect(_.get(o, "a['[']"));
    expect(_.get(o, "a['\"\\'']"));
    expect(_.get(o, 'a["\\"\'"]'));
    expect(_.get(o, "a['.']"));

    let index = _.index(o);
    _.each(index, (v, k) => {
      expect(_.get(o, k));
    });
  });
});
const hrend = process.hrtime(hrstart);
console.info('✓ %ds %dms', hrend[0], hrend[1] / 1000000);
