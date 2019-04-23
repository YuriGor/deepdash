'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect;

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular } = require('./object');

var { forLodashes } = require('./common.js');
forLodashes(['omitDeep'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    let clean = _.omitDeep(obj, 'skip');
    clean = _.omitDeep(clean, 'o', { onMatch: { skipChildren: true } });
    expect(clean).to.deep.equal({
      a: {
        b: {
          c: {
            d: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }, { i: 5 }, {}],
            s: 'hello',
          },
          b: true,
        },
        n: 12345,
        u: undefined,
      },
      nl: null,
    });
    expect(obj).to.deep.equal(orig);
  });
  it('demo skip', () => {
    let clean = _.omitDeep(demo, 'skip');
    clean = _.omitDeep(clean, 'o', { onMatch: { skipChildren: true } });
    expect(clean).to.deep.equal({
      a: {
        b: {
          c: {
            d: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }, { i: 5 }, {}],
            s: 'hello',
          },
          b: true,
        },
        n: 12345,
        u: undefined,
      },
      nl: null,
    });
  });
  it('array of keys', () => {
    let obj = {
      good1: true,
      bad1: false,
      good2: { good3: true, bad3: false },
      bad2: { good: true },
      good4: [{ good5: true, bad5: false }],
      bad4: [],
    };
    let clean = _.omitDeep(obj, ['bad1', 'bad2', 'bad3', 'bad4', 'bad5'], {
      onMatch: { skipChildren: true },
    });
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true },
      good4: [{ good5: true }],
    });
  });
  it('regex', () => {
    let obj = {
      good1: true,
      bad1: false,
      good2: { good3: true, bad3: false },
      bad2: { good: true },
      good4: [{ good5: true, bad5: true }],
      bad4: [],
    };
    let clean = _.omitDeep(obj, /\.?bad.*$/);
    expect(clean).to.deep.equal({
      good1: true,
      good2: { good3: true },
      good4: [{ good5: true }],
    });
  });
});
