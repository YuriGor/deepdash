'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo } = require('./object');

describe('pickDeep', () => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    let clean = _.pickDeep(obj, 'skip');
    expect(clean).to.deep.equal({
      a: {
        b: {
          c: {
            d: [
              {
                o: {
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
          },
        },
      },
    });
    expect(obj).to.deep.equal(orig);
  });
  it('demo skip', () => {
    let clean = _.pickDeep(demo, 'skip');

    expect(clean).to.deep.equal({
      a: {
        b: {
          c: {
            d: [
              {
                o: {
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
          },
        },
      },
    });
  });
  it('array of keys', () => {
    let obj = {
      good1: true,
      bad1: false,
      good2: { good3: true, bad3: true },
      bad2: { good: true },
      good4: [{ good5: true, bad5: true }],
      bad4: [],
    };
    let clean = _.pickDeep(obj, [
      'good1',
      'good2',
      'good3',
      'good',
      'good4',
      'good5',
    ]);
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true, bad3: true },
      bad2: { good: true },
      good4: [{ good5: true, bad5: true }],
    });
  });
  it('regex', () => {
    let obj = {
      good1: true,
      bad1: false,
      good2: { good3: true, bad3: true },
      bad2: { good: true },
      good4: [{ good5: true, bad5: true }],
      bad4: [],
    };
    let clean = _.pickDeep(obj, /\.?good.*$/);
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true, bad3: true },
      bad2: { good: true },
      good4: [{ good5: true, bad5: true }],
    });
  });
});
