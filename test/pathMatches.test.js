'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect;

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { forLodashes } = require('./common.js');
forLodashes(['pathMatches'], (_) => {
  it('field', () => {
    expect(_.pathMatches('test[0]', '[0]')).to.deep.equal(['0']);
    expect(_.pathMatches('test[0]', 'test')).to.equal(false);
  });
  it('path', () => {
    expect(_.pathMatches('test.a[0].hello', 'a[0].hello')).to.deep.equal([
      'a',
      '0',
      'hello',
    ]);
  });
  it('regex', () => {
    expect(_.pathMatches('test.a[0].hello', /a\[\d\]/)).to.not.equal(false);
  });
  it('not supported', () => {
    try {
      _.pathMatches('test.a[0].hello', () => true);
    } catch (exc) {
      expect(exc.message).to.equal(
        'To match path use only string/regex or array of them.'
      );
    }
  });
});
