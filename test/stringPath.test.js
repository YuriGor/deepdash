'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

describe('string paths', () => {
  it('[.]\'"', () => {
    let o = { a: { '[': 'c', '"\'': 'd', '.': 'e' } };

    expect(_.get(o, "a['[']")).to.equal('c');
    expect(_.get(o, "a['\"\\'']")).to.equal('d');
    expect(_.get(o, 'a["\\"\'"]')).to.equal('d');
    expect(_.get(o, "a['.']")).to.equal('e');

    let index = _.indexate(o);
    _.each(index, (v, k) => {
      expect(_.get(o, k)).to.equal(v);
    });
  });
});
