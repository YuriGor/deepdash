'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
var { demo, circular } = require('./object');

describe('eachDeep', () => {
  it('Count nodes', () => {
    let c = 0;
    _.eachDeep(demo, (value, key) => {
      if (key == 'skip') return false;
      c++;
    });
    expect(c).equal(25);
  });
  it('Chaining', () => {
    let c = 0;
    _(demo)
      .eachDeep((value, key) => {
        if (key == 'skip') return false;
        c++;
      })
      .value();
    expect(c).equal(25);
  });
  it('alias forEachDeep', () => {
    let c = 0;
    _.forEachDeep(demo, () => {
      c++;
    });
    expect(c).equal(30);
  });
  it('returns collection', () => {
    let c = _.forEachDeep(demo, () => {
      /*hello?*/
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
    _.eachDeep(
      circular,
      (value, key, obj, ctx) => {
        if (_.findIndex(ctx.parents, ['value', value]) != -1) {
          circluarPath.push(ctx.path);

          return false;
        }
      },
      { track: true }
    );

    expect(circluarPath)
      .to.include('a.b.c.e')
      .and.to.include('i[5][0]')
      .and.to.include('i[5][1][0].b.c.e')
      .and.to.have.property('length')
      .and.equal(3);
  });

  it('circular with array path format', () => {
    let circluarPath = [];
    _.eachDeep(
      circular,
      (value, key, obj, ctx) => {
        ctx.parents.forEach((p) => {
          expect(p.path).to.be.an.array();
        });
        if (_.findIndex(ctx.parents, ['value', value]) != -1) {
          circluarPath.push(_.pathToString(ctx.path));

          return false;
        }
      },
      { track: true, pathFormat: 'array' }
    );

    expect(circluarPath)
      .to.include('a.b.c.e')
      .and.to.include('i[5][0]')
      .and.to.include('i[5][1][0].b.c.e')
      .and.to.have.property('length')
      .and.equal(3);
  });

  it('Array', () => {
    let c = 0;
    _.eachDeep([demo, demo], (value, key) => {
      if (key == 'skip') return false;
      c++;
    });
    expect(c).equal(52);
  });

  it('String', () => {
    let c = 0;
    _.eachDeep('Hello?', (value, key) => {
      if (key == 'skip') return false;
      c++;
    });
    expect(c).equal(0);
  });
  it('empty props', () => {
    let c = 0;
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    _.eachDeep(o, () => {
      c++;
    });
    expect(c).equal(2);
    c = 0;
    var a = ['a', 'b', 'c'];
    delete a[1];
    _.eachDeep(a, () => {
      c++;
    });
    expect(c).equal(2);
    c = 0;
    var slots = ['start', , 'middle', , 'finish'];
    _.eachDeep(slots, () => {
      c++;
    });
    expect(c).equal(3);
  });
  it('generated string paths are correct', () => {
    _.eachDeep(demo, function(value, key, obj, ctx) {
      assert(_.has(demo, ctx.path), 'Incorrect path: ' + ctx.path);
    });
  });
  it('generated array paths are correct', () => {
    _.eachDeep(
      demo,
      function(value, key, obj, ctx) {
        assert(_.has(demo, ctx.path), 'Incorrect path: ' + ctx.path);
      },
      { pathFormat: 'array' }
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
    _.eachDeep(obj, (v) => {
      expect(v).not.to.equal(undefined);
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
    _.eachDeep(obj, (v) => {
      if (v === undefined) {
        u++;
      }
    });
    expect(u).to.equal(6);
  });
});
