'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { demo, circular, social } = require('./object');
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

  it('Get specific children', () => {
    let names = _.reduceDeep(
      social,
      (res, v, k, p, c) => {
        res.push(v.name);
        return res;
      },
      [],
      { childrenPath: ['parents', 'children'] }
    );
    expect(names).to.deep.equal([
      'Dalton Hull',
      'Francis Landry',
      'Alexandra Byrd',
      'Nicole Mcdaniel',
      'Dale Booth',
      'Peck Herman',
      'Ada Crosby',
      'Golden Vasquez',
      'Cameron Stout',
      'Stewart Hays',
      'Saunders Craig',
      'Young Marshall',
      'Bryant Bright',
    ]);
  });

  it('Get specific children rootIsChildren', () => {
    let names = _.reduceDeep(
      {
        p0: social[0],
        p1: social[1],
        p2: social[2],
      },
      (res, v, k, p, c) => {
        res.push(v.name);
        return res;
      },
      [],
      {
        childrenPath: ['parents', 'children'],
        rootIsChildren: true,
        includeRoot: false,
      }
    );
    expect(names).to.deep.equal([
      'Dalton Hull',
      'Francis Landry',
      'Alexandra Byrd',
      'Nicole Mcdaniel',
      'Dale Booth',
      'Peck Herman',
      'Ada Crosby',
      'Golden Vasquez',
      'Cameron Stout',
      'Stewart Hays',
      'Saunders Craig',
      'Young Marshall',
      'Bryant Bright',
    ]);
  });

  it('Get first from specific children', () => {
    let names = _.reduceDeep(
      social,
      (res, v, k, p, c) => {
        if (c.childrenPath == 'friends' && k == 0) {
          //console.log(c);
          res.push(v.name);
        }
        return res;
      },
      [],
      { childrenPath: 'friends' }
    );
    expect(names).to.deep.equal([
      'Hillary Perry',
      'Mcdowell Reyes',
      'Burgess York',
    ]);
  });
});
