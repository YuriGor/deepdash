'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { demo, children } = require('./object')();
var { validateIteration, forLodashes } = require('./common.js');

forLodashes(['mapDeep'], (_) => {
  it('defaults', () => {
    let res = _.mapDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx, { method: 'mapDeep' });
      if (_.isArray(value)) {
        return key + ':[]';
      }
      if (_.isObject(value)) {
        return key + ':{}';
      }
      return key + ': ' + (value + '').toUpperCase();
    });
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '["undefined:{}","a:{}","b:{}","c:{}","d:[]","0:{}","i: 0","1:{}","i: 1","2:{}","i: 2","3:{}","i: 3","4:{}","i: 4","5:{}","i: 5","6:{}","o:{}","d:{}","f:{}","skip:{}","please:{}","dont:{}","go:{}","here: SKIP IT","s: HELLO","b: TRUE","n: 12345","u: UNDEFINED","nl: NULL"]'
    );
  });
  it('leavesOnly', () => {
    let res = _.mapDeep(
      demo,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return (value + '').toUpperCase();
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '["0","1","2","3","4","5","DATE SKIPPED","FUNCTION() {}","SKIP IT","HELLO","TRUE","12345","UNDEFINED","NULL"]'
    );
  });

  it('array', () => {
    let res = _.mapDeep(
      [demo],
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return (value + '').toUpperCase();
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '["0","1","2","3","4","5","DATE SKIPPED","FUNCTION() {}","SKIP IT","HELLO","TRUE","12345","UNDEFINED","NULL"]'
    );
  });

  it('primitive', () => {
    _.each([0, 1, 2, 'a', 'bcd', true, false, null, undefined], (v) => {
      expect(_.mapDeep(v)).to.deep.equal([v]);
    });
  });

  it('tree mode', () => {
    let res = _.mapDeep(
      children,
      (v) => {
        return v.name.toUpperCase();
      },
      { childrenPath: 'children' }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).to.equal(
      '["GRAND 1","PARENT 1.1","CHILD 1.1.1","CHILD 1.1.2","PARENT 1.2","CHILD 1.2.1","CHILD 1.2.2","GRAND 2","PARENT 2.1","CHILD 2.1.1","CHILD 2.1.2","PARENT 2.2","CHILD 2.2.1","CHILD 2.2.2"]'
    );
  });

  it('tree mode - rootIsChildren', () => {
    let res = _.mapDeep(
      { g1: children[0], g2: children[1] },
      (v, k, p, c) => {
        return v.name.toUpperCase();
      },
      { childrenPath: 'children', rootIsChildren: true, includeRoot: false }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).to.equal(
      '["GRAND 1","PARENT 1.1","CHILD 1.1.1","CHILD 1.1.2","PARENT 1.2","CHILD 1.2.1","CHILD 1.2.2","GRAND 2","PARENT 2.1","CHILD 2.1.1","CHILD 2.1.2","PARENT 2.2","CHILD 2.2.1","CHILD 2.2.2"]'
    );
  });
});
