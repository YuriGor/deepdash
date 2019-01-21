'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

describe('exists', () => {
  it('slot 0', () => {
    var arr = [, 'b', , 'd', 'e'];
    expect(_.exists(arr, 0)).to.equal(false);
    expect(_.exists(arr, 1)).to.equal(true);
    expect(_.exists(arr, 2)).to.equal(false);
    expect(_.exists(arr, 3)).to.equal(true);
    expect(_.exists(arr, 4)).to.equal(true);
    arr = ['a', 'b', 'c', 'd', 'e'];
    delete arr[0];
    delete arr[2];
    expect(_.exists(arr, 0)).to.equal(false);
    expect(_.exists(arr, 1)).to.equal(true);
    expect(_.exists(arr, 2)).to.equal(false);
    expect(_.exists(arr, 3)).to.equal(true);
    expect(_.exists(arr, 4)).to.equal(true);
    arr = [arr];
    expect(_.exists(arr, '[0][0]')).to.equal(false);
    expect(_.exists(arr, '[0][1]')).to.equal(true);
    expect(_.exists(arr, '[0][2]')).to.equal(false);
    expect(_.exists(arr, '[0][3]')).to.equal(true);
    expect(_.exists(arr, '[0][4]')).to.equal(true);
    expect(_.exists(arr, [0, 0])).to.equal(false);
    expect(_.exists(arr, [0, 1])).to.equal(true);
    expect(_.exists(arr, [0, 2])).to.equal(false);
    expect(_.exists(arr, [0, 3])).to.equal(true);
    expect(_.exists(arr, [0, 4])).to.equal(true);
  });
});
