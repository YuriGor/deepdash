const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
const forArray = require('../forArray');
describe('self-inplemented dependency fulfillment', () => {
  it('forArray', () => {
    let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    let res = [];
    forArray(arr, (c) => res.push(c));
    expect(res).to.deep.equal(arr);
    res = [];
    forArray(arr, (c) => res.push(c) && c != 'd');
    expect(res).to.deep.equal(['a', 'b', 'c', 'd']);
  });
});
