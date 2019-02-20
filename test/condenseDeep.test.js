'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
var { demo, circular } = require('./object');
chai.use(asserttype);

describe('condense', () => {
  it('slot 0', () => {
    var arr = [, 'b', 'c', 'd', 'e'];
    _.condense(arr);
    expect(arr).to.deep.equal(['b', 'c', 'd', 'e']);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[0];
    _.condense(arr);
    expect(arr).to.deep.equal(['b', 'c', 'd', 'e']);
  });
  it('slot 1', () => {
    var arr = ['a', 'c', 'd', 'e'];
    _.condense(arr);
    expect(arr).to.deep.equal(['a', 'c', 'd', 'e']);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[1];
    _.condense(arr);
    expect(arr).to.deep.equal(['a', 'c', 'd', 'e']);
  });
  it('slot last', () => {
    var arr = ['a', 'b', 'c', 'd'];
    _.condense(arr);
    expect(arr).to.deep.equal(['a', 'b', 'c', 'd']);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[4];
    _.condense(arr);
    expect(arr).to.deep.equal(['a', 'b', 'c', 'd']);
  });
});

describe('condenseDeep', () => {
  it('slot 0', () => {
    var arr = [, 'b', 'c', 'd', 'e'];
    _.condenseDeep(arr);
    expect(arr).to.deep.equal(['b', 'c', 'd', 'e']);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[0];
    _.condenseDeep(arr);
    expect(arr).to.deep.equal(['b', 'c', 'd', 'e']);
  });
  it('slot 1', () => {
    var arr = ['a', 'c', 'd', 'e'];
    _.condenseDeep(arr);
    expect(arr).to.deep.equal(['a', 'c', 'd', 'e']);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[1];
    _.condenseDeep(arr);
    expect(arr).to.deep.equal(['a', 'c', 'd', 'e']);
  });
  it('slot last', () => {
    var arr = ['a', 'b', 'c', 'd'];
    _.condenseDeep(arr);
    expect(arr).to.deep.equal(['a', 'b', 'c', 'd']);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[4];
    _.condenseDeep(arr);
    expect(arr).to.deep.equal(['a', 'b', 'c', 'd']);
  });
  it('deep slot', () => {
    var obj = _.cloneDeep(circular);
    delete obj.i[1];
    delete obj.i[2];
    expect(
      _(obj)
        .condenseDeep({ checkCircular: true })
        .paths({ checkCircular: true, leavesOnly: false })
        .value().length
    ).to.equal(23);
  });
});
