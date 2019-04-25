'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { demo, circular } = require('./object');
var { validateIteration, forLodashes } = require('./common.js');

forLodashes(['reduceDeep'], (_) => {
  it('defaults', () => {
    let res = _.reduceDeep(
      demo,
      (acc, value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'reduceDeep' });
        acc.push(key);
        return acc;
      },
      []
    );

    expect(JSON.stringify(res)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","please","dont","go","here","s","b","n","u","nl"]'
    );
  });

  it('defaults, no initial', () => {
    let res = _.reduceDeep(
      { a: 2, b: 3, c: { d: 6, e: [1, 5, 8] } },
      (acc, value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'reduceDeep' });
        if (typeof value == 'number' && (typeof acc != 'number' || value > acc))
          return value;
        return undefined;
      }
    );
    expect(res).equal(8);
  });
});
