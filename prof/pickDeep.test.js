'use strict';

var { demo } = require('./object')();

var { forLodashes, it, expect } = require('./common.js');
forLodashes(['pickDeep'], (_) => {
  it('pickDeep no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    let oPaths = ['skip'];
    let paths = _.cloneDeep(oPaths);
    let clean = _.pickDeep(obj, paths, {
      onMatch: { cloneDeep: true, skipChildren: true },
    });
    expect(clean);
    expect(obj);
    expect(paths);
  });
  it('demo skip', () => {
    let clean = _.pickDeep(demo, 'skip', {
      onMatch: { skipChildren: true, cloneDeep: true },
    });

    expect(clean);
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
    expect(clean);
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
    expect(clean);
  });
});
