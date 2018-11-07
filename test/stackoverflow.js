'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
var { demo, circular } = require('./object');

describe('stackoverflow', () => {
  //https://stackoverflow.com/questions/41610948/lodash-find-deep-in-array-of-object
  it('lodash-find-deep-in-array-of-object', () => {
    let obj = [
      {
        a: 10,
        elements: [
          {
            prop: 'foo',
            val: 10,
          },
          {
            prop: 'bar',
            val: 25,
          },
          {
            prop: 'test',
            val: 51,
          },
        ],
      },
      {
        b: 50,
        elements: [
          {
            prop: 'foo',
            val: 30,
          },
          {
            prop: 'bar',
            val: 15,
          },
          {
            prop: 'test',
            val: 60,
          },
        ],
      },
    ];
    let sum = 0;
    _.eachDeep(
      obj,
      (value, key, path, depth, parent, parentKey, parentPath) => {
        sum += (key == 'prop' && value == 'foo' && parent.val) || 0;
      }
    );
    expect(sum).equal(40);
  });
});
