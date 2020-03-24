'use strict';

var { demo, children } = require('./object')();
var { validateIteration, forLodashes, it, expect } = require('./common.js');

forLodashes(['mapValuesDeep'], (_) => {
  it('defaults', () => {
    let res = _.mapValuesDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx, { method: 'mapValuesDeep' });
      if (value instanceof Date) return 'DATE SKIPPED';
      if (typeof value == 'object') return { '?': '!' };
      return value + '';
    });
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res));
  });
  it('leavesOnly', () => {
    let res = _.mapValuesDeep(
      demo,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapValuesDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return value + '';
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res));
  });

  it('array', () => {
    let res = _.mapValuesDeep(
      [demo],
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapValuesDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return value + '';
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res));
  });

  it('primitive', () => {
    _.each([0, 1, 2, 'a', 'bcd', true, false, null, undefined], (v) => {
      expect(_.mapValuesDeep(v));
    });
  });

  it('tree mode', () => {
    let res = _.mapValuesDeep(
      children,
      (v) => {
        return { title: v.name };
      },
      { childrenPath: 'children' }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res));
  });

  it('tree mode - rootIsChildren', () => {
    let res = _.mapValuesDeep(
      { g1: children[0], g2: children[1] },
      (v, k, p, c) => {
        return { title: v.name };
      },
      { childrenPath: 'children', rootIsChildren: true, includeRoot: false }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res));
  });
});
