'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect;
// assert = require('assert'),
// var _ = require('lodash'),
//   deep = require('../dist/cjs/deepdash');

const asserttype = require('chai-asserttype');
chai.use(asserttype);
describe('Script load for browsers', () => {
  // it('lodash not exists', () => {
  //   process.env.likebrowser = true;
  //   delete require.cache[require.resolve('../dist/cjs/deepdash')];
  //   let err = '';
  //   try {
  //     let deep = require('../dist/cjs/deepdash');
  //   } catch (exc) {
  //     err = exc.message;
  //   }
  //   expect(err).to.equal('No lodash to mixin');
  //   delete process.env.likebrowser;
  // });
  it('lodash exists', () => {
    process.env.likebrowser = true;
    global._ = require('lodash').runInContext();
    delete require.cache[require.resolve('../dist/cjs/deepdash')];
    expect(_.eachDeep).to.equal(undefined);
    require('../dist/cjs/deepdash');

    expect(_.eachDeep).to.be.a('function');
    delete process.env.likebrowser;
  });
});
