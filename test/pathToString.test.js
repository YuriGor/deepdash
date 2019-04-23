'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../dist/cjs/deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { forLodashes } = require('./common.js');
forLodashes(['pathToString'], (_) => {
  it('a.b.c.defg[0][1]["2.3"]', () => {
    expect(_.pathToString(['a', 'b', 'c', 'defg', 0, '1', 2.3])).to.equal(
      'a.b.c.defg[0][1]["2.3"]'
    );
  });
  it('escape double quote', () => {
    expect(_.pathToString(['"', '"', '"'])).to.equal('["\\""]["\\""]["\\""]');
  });
  it('return string as is', () => {
    expect(_.pathToString('it.s.a.string')).to.equal('it.s.a.string');
  });
});
