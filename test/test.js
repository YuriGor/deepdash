const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

describe('Main', function() {
  let obj = {
    a: {
      b: {
        c: {
          d: [
            { i: 0 },
            { i: 1 },
            { i: 2 },
            { i: 3 },
            { i: 4 },
            { i: 5 },
            {
              o: {
                d: new Date(),
                f: function() {},
                skip: {
                  please: {
                    dont: {
                      go: {
                        here: 'skip it',
                      },
                    },
                  },
                },
              },
            },
          ],
          s: 'hello',
        },
        b: true,
      },
      n: 12345,
      u: undefined,
    },
    nl: null,
  };
  it('Count nodes', () => {
    let c = 0;
    _.eachDeep(
      obj,
      (value, key, path, depth, parent, parentKey, parentPath) => {
        if (key == 'skip') return false;
        c++;
      }
    );
    expect(c).equal(25);
  });
  it('Chaining',()=>{
    let c = 0;
    _(obj).eachDeep(
      (value, key, path, depth, parent, parentKey, parentPath) => {
        if (key == 'skip') return false;
        c++;
      }
    ).value();
    expect(c).equal(25);
  });
});
