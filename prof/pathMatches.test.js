'use strict';

var { forLodashes, it, expect } = require('./common.js');
var hrstart = process.hrtime();
forLodashes(['pathMatches'], (_) => {
  it('field', () => {
    expect(_.pathMatches('test[0]', '[0]'));
    expect(_.pathMatches('test[0]', 'test'));
  });
  it('path', () => {
    expect(_.pathMatches('test.a[0].hello', 'a[0].hello'));
  });
  it('regex', () => {
    expect(_.pathMatches('test.a[0].hello', /a\[\d\]/));
  });
  it('not supported', () => {
    try {
      _.pathMatches('test.a[0].hello', () => true);
    } catch (exc) {
      expect(exc.message);
    }
  });
});
const hrend = process.hrtime(hrstart);
console.info('✓ %ds %dms', hrend[0], hrend[1] / 1000000);
