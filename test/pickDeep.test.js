'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect;

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo } = require('./object');

var { forLodashes } = require('./common.js');
forLodashes(['pickDeep'], (_) => {
  it('pickDeep no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    let oPaths = ['skip'];
    let paths = _.cloneDeep(oPaths);
    let clean = _.pickDeep(obj, paths, {
      onMatch: { cloneDeep: true, skipChildren: true },
    });
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
    expect(paths).to.deep.equal(oPaths);
  });
  it('demo skip', () => {
    let clean = _.pickDeep(demo, 'skip', {
      onMatch: { skipChildren: true, cloneDeep: true },
    });

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
      'good',
      'good1',
      'good2',
      'good3',
      'good4',
      'good5',
    ]);
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true },
      bad2: { good: true },
      good4: [{ good5: true }],
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
    let clean = _.pickDeep(obj, /\.?good\d*$/);
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true },
      bad2: { good: true },
      good4: [{ good5: true }],
    });
  });
});
