'use strict';

var { forLodashes, it, expect } = require('./common.js');
var hrstart = process.hrtime();
forLodashes(['pathToString'], (_) => {
  it('a.b.c.defg[0][1]["2.3"]', () => {
    expect(_.pathToString(['a', 'b', 'c', 'defg', 0, '1', 2.3]));
  });
  it('escape double quote', () => {
    expect(_.pathToString(['"', '"', '"']));
  });
  it('return string as is', () => {
    expect(_.pathToString('it.s.a.string'));
  });
});
const hrend = process.hrtime(hrstart);
console.info('✓ %ds %dms', hrend[0], hrend[1] / 1000000);
