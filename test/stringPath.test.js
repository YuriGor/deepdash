'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../dist/cjs/deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { forLodashes } = require('./common.js');
forLodashes(['index'], (_) => {
  it('[.]\'"', () => {
    let o = { a: { '[': 'c', '"\'': 'd', '.': 'e' } };

    expect(_.get(o, "a['[']")).to.equal('c');
    expect(_.get(o, "a['\"\\'']")).to.equal('d');
    expect(_.get(o, 'a["\\"\'"]')).to.equal('d');
    expect(_.get(o, "a['.']")).to.equal('e');

    let index = _.index(o);
    _.each(index, (v, k) => {
      expect(_.get(o, k)).to.equal(v);
    });
  });
});
