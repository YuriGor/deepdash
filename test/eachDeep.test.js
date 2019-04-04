'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { demo, circular } = require('./object');
var { validateIteration } = require('./common.js');

describe('eachDeep', () => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.eachDeep(obj, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      if (key == 'skip') return false;
    });
    expect(obj).to.deep.equal(orig);
  });
  it('eachDeep defaults', () => {
    let keys = [];
    _.eachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return false;
    });

    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl"]'
    );
  });
  it('Chaining', () => {
    let keys = [];
    _(demo)
      .eachDeep((value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx);
        keys.push(key);
        if (key == 'skip') return false;
      })
      .value();
    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl"]'
    );
  });
  it('alias forEachDeep', () => {
    let keys = [];
    _.forEachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
    });
    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","please","dont","go","here","s","b","n","u","nl"]'
    );
  });
  it('returns collection', () => {
    let c = _.forEachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
    });
    expect(c).equal(demo);
  });
  it('no callback', () => {
    let c = _.forEachDeep(demo);
    expect(c).equal(demo);
    c = _(demo)
      .forEachDeep()
      .value();
    expect(c).equal(demo);
  });

  it('circular', () => {
    let circluarPath = [];
    let options = { checkCircular: true };
    _.eachDeep(
      circular,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.isCircular) {
          circluarPath.push(ctx.path);

          return false;
        }
      },
      options
    );
    expect(JSON.stringify(circluarPath)).equal(
      '["a.b.c.e","i[5][0]","i[5][1][0].b.c.e"]'
    );
  });

  it('circular with array path format', () => {
    let circluarPath = [];
    let options = { checkCircular: true, pathFormat: 'array' };
    _.eachDeep(
      circular,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        ctx.parents.forEach((p, i) => {
          if (i) {
            expect(p.path).to.be.an.array();
          } else {
            expect(p.path).equal(undefined);
          }
        });
        if (ctx.isCircular) {
          circluarPath.push(_.pathToString(ctx.path));
          return false;
        }
      },
      options
    );
    expect(JSON.stringify(circluarPath)).equal(
      '["a.b.c.e","i[5][0]","i[5][1][0].b.c.e"]'
    );
  });

  it('Array', () => {
    let keys = [];
    _.eachDeep([demo, demo], (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return false;
    });
    expect(JSON.stringify(keys)).equal(
      '["0","a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl","1","a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl"]'
    );
  });

  it('String', () => {
    let paths = [];
    _.eachDeep('Hello?', (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal([undefined]);
  });

  it('empty props', () => {
    let paths = [];
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    _.eachDeep(o, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal([undefined, 'a', 'c']);
    paths = [];
    var a = ['a', 'b', 'c'];
    delete a[1];
    _.eachDeep(a, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal(['[0]', '[2]']);
    paths = [];
    var slots = ['start', , 'middle', , 'finish'];
    _.eachDeep(slots, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal(['[0]', '[2]', '[4]']);
  });
  it('generated string paths are correct', () => {
    _.eachDeep(demo, function(value, key, parent, ctx) {
      validateIteration(value, key, parent, ctx);
      if (parent) {
        assert(_.exists(demo, ctx.path), 'Incorrect path: ' + ctx.path);
      }
    });
  });
  it('generated array paths are correct', () => {
    let options = { pathFormat: 'array' };
    _.eachDeep(
      demo,
      function(value, key, parent, ctx) {
        validateIteration(value, key, parent, ctx, options);
        assert(
          _.obtain(demo, ctx.path) === value,
          'Incorrect path: ' + ctx.path
        );
      },
      options
    );
  });
  it('empty slots skipped', () => {
    var obj = [
      ,
      [, { a: 'b' }, , { c: 'd' }, [, 1, , 2, , 3]],
      ,
      [, , , 'a'],
      {},
    ];
    _.eachDeep(obj, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      expect(value).not.to.equal(undefined);
    });
  });
  it('undefined are valid values, no skip', () => {
    var obj = [
      ,
      [
        ,
        { a: undefined },
        ,
        { c: undefined },
        [, undefined, , undefined, , undefined],
      ],
      ,
      [, , , undefined],
      {},
    ];
    let u = 0;
    _.eachDeep(obj, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      if (value === undefined) {
        u++;
      }
    });
    expect(u).to.equal(6);
  });
});
