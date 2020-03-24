'use strict';
/* eslint-disable no-sparse-arrays */

// assert = require('assert'),

var { circular } = require('./object')();

var { forLodashes, it, expect } = require('./common.js');

forLodashes('condense', (_) => {
  it('slot 0', () => {
    var arr = [, 'b', 'c', 'd', 'e'];
    _.condense(arr);
    expect(arr);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[0];
    _.condense(arr);
    expect(arr);
  });
  it('slot 1', () => {
    var arr = ['a', 'c', 'd', 'e'];
    _.condense(arr);
    expect(arr);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[1];
    _.condense(arr);
    expect(arr);
  });
  it('slot last', () => {
    var arr = ['a', 'b', 'c', 'd'];
    _.condense(arr);
    expect(arr);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[4];
    _.condense(arr);
    expect(arr);
  });
});

forLodashes(['condenseDeep', 'paths'], (_) => {
  it('slot 0', () => {
    var arr = [, 'b', 'c', 'd', 'e'];
    _.condenseDeep(arr);
    expect(arr);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[0];
    _.condenseDeep(arr);
    expect(arr);
  });
  it('slot 1', () => {
    var arr = ['a', 'c', 'd', 'e'];
    _.condenseDeep(arr);
    expect(arr);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[1];
    _.condenseDeep(arr);
    expect(arr);
  });
  it('slot last', () => {
    var arr = ['a', 'b', 'c', 'd'];
    _.condenseDeep(arr);
    expect(arr);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[4];
    _.condenseDeep(arr);
    expect(arr);
  });
  it('deep slot', () => {
    var obj = _.cloneDeep(circular);
    delete obj.i[1];
    delete obj.i[2];
    obj = _.condenseDeep(obj, { checkCircular: true });
    expect(_.paths(obj, { checkCircular: true, leavesOnly: false }).length);
  });
});
