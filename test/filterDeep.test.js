'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular } = require('./object');
function isNS(value) {
  let t = typeof value;
  return t == 'number' || t == 'string';
}

describe('filterDeep', () => {
  it('Count paths', () => {
    let filtrate = _(demo)
      .filterDeep(isNS, { leafsOnly: true })
      .indexate({ leafsOnly: true })
      .value();
    // console.log(_.filterDeep(demo, isNS));
    expect(_.size(filtrate)).equal(9);
  });
  it('Array', () => {
    let filtrate = _.filterDeep([demo, demo], isNS, { leafsOnly: true });
    expect(filtrate).to.be.an('array');
    filtrate = _.indexate(filtrate, { leafsOnly: true });
    expect(_.size(filtrate)).equal(18);
  });
  it('Count paths circular', () => {
    let filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leafsOnly: true,
    });
    // console.log(circular);
    // console.log(filtrate);
    filtrate = _.paths(filtrate, {
      leafsOnly: true,
      checkCircular: true,
    });
    // console.log(filtrate);
    expect(_.size(filtrate)).equal(11);
  });
  it('Chaining', () => {
    let filtrate = _(demo)
      .filterDeep(isNS, { leafsOnly: true })
      .paths({ leafsOnly: true })
      .value();
    expect(_.size(filtrate)).equal(9);
  });

  it('returns empty obj', () => {
    let filtrate = _.filterDeep(1, () => true);
    expect(filtrate).to.deep.equal({});

    filtrate = _.filterDeep('123', () => true);
    expect(filtrate).to.deep.equal({});

    filtrate = _.filterDeep(null, () => true);
    expect(filtrate).to.deep.equal({});

    filtrate = _.filterDeep(undefined, () => true);
    expect(filtrate).to.deep.equal({});

    filtrate = _.filterDeep(() => {}, () => true);
    expect(filtrate).to.deep.equal({});

    filtrate = _.filterDeep(new Date(), () => true);
    expect(filtrate).to.deep.equal({});

    filtrate = _.filterDeep(/.*/, () => true);
    expect(filtrate).to.deep.equal({});
  });

  it('Obj only', () => {
    let filtrate = _(demo)
      .filterDeep(_.isObject, {
        leafsOnly: false,
        cloneDeep: (o) => (_.isArray(o) ? [] : _.isObject ? {} : o),
      })
      .paths({ leafsOnly: false })
      .value();
    expect(_.size(filtrate)).equal(18);
  });
  it('Circular', () => {
    let filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leafsOnly: true,
    });
    filtrate.should.have.nested.property('a.b.c.e').and.equal(filtrate.a.b);
    // console.log(_.get(filtrate, 'i[5][1][0].b'));
    // console.log(_.get(filtrate, 'a.b'));
    // console.log(circular);
    //console.log(filtrate);
    filtrate.should.have.nested.property('i[5][0]').and.equal(filtrate);
    filtrate.should.have.nested
      .property('i[5][1][0].b.c.e')
      .and.equal(filtrate.i[5][1][0].b);
  });
  it("Don't keep circular", () => {
    let filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      keepCircular: false,
      leafsOnly: true,
    });
    // console.log(circular);
    //console.log(filtrate);
    filtrate = _.paths(filtrate, {
      leafsOnly: true,
      checkCircular: true,
    });
    // console.log(filtrate);
    expect(_.size(filtrate)).equal(8);
  });
  it('Not matched circular ', () => {
    let obj = { a: { b: {} } };
    obj.a.b.c = obj;
    obj.a.b.text = 'test';
    obj.x = { y: { z: {} } };
    obj.x.y.z.c = obj.x;
    obj.x.y.z1 = obj.x.y;
    let filtrate = _.filterDeep(obj, isNS, {
      checkCircular: true,
      leafsOnly: true,
    });
    // console.log(filtrate);
    filtrate.should.not.have.property('x');
  });
  it('Sparse array', () => {
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    var filtrate = _.filterDeep(obj, (v) => v === true, { leafsOnly: true });
    filtrate.should.deep.equal({ a: [{ b: true }] });
    filtrate = _.filterDeep(obj, (v) => v === true, {
      leafsOnly: true,
      condense: false,
    });
    filtrate.should.deep.equal({ a: [, , { b: true }] });
  });
  it('replaceCircularBy', () => {
    let again = Symbol('[circular]');
    let filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leafsOnly: true,
      replaceCircularBy: again,
    });
    // console.log(filtrate);
    filtrate.should.have.nested.property('a.b.c.e').and.equal(again);
    filtrate.should.have.nested.property('i[5][0]').and.equal(again);
    filtrate.should.have.nested.property('i[5][1][0].b.c.e').and.equal(again);
    filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leafsOnly: true,
      replaceCircularBy: undefined,
    });
    // console.log(filtrate);
    filtrate.should.have.nested.property('a.b.c.e').and.equal(undefined);
    filtrate.should.have.nested.property('i[5][0]').and.equal(undefined);
    filtrate.should.have.nested
      .property('i[5][1][0].b.c.e')
      .and.equal(undefined);
  });
  it('array path format', () => {
    const input = [
      {
        value: 'Miss1',
        children: [
          { value: 'Miss2' },
          { value: 'Hit1', children: [{ value: 'Miss3' }] },
        ],
      },
      {
        value: 'Miss4',
        children: [
          { value: 'Miss5' },
          { value: 'Miss6', children: [{ value: 'Hit2' }] },
        ],
      },
      {
        value: 'Miss7',
        children: [
          { value: 'Miss8' },
          { value: 'Miss9', children: [{ value: 'Miss10' }] },
        ],
      },
      {
        value: 'Hit3',
        children: [
          { value: 'Miss11' },
          { value: 'Miss12', children: [{ value: 'Miss13' }] },
        ],
      },
      {
        value: 'Miss14',
        children: [
          { value: 'Hit4' },
          { value: 'Miss15', children: [{ value: 'Miss16' }] },
        ],
      },
    ];
    var keyword = 'Hit';
    // We will need 2 passes, first - to collect needed nodes with 'Hit' value:
    var foundHit = _.filterDeep(
      input,
      function(value, key, obj, ctx) {
        expect(ctx.path).to.be.an.array();
        expect(ctx.parentPath).to.be.an.array();
        if (value.value && value.value.includes(keyword)) return true;
      },
      {
        condense: false, // keep empty slots in array to preserve correct paths
        leafsOnly: false,
        pathFormat: 'array',
      }
    );
    // second pass - to add missed fields both for found 'Hit' nodes and their parents.
    var filtrate = _.filterDeep(
      input,
      function(value, key, obj, ctx) {
        expect(ctx.path).to.be.an.array();
        expect(ctx.parentPath).to.be.an.array();
        if (
          _.get(foundHit, ctx.path) !== undefined ||
          _.get(foundHit, ctx.parentPath) !== undefined
        ) {
          return true;
        }
      },
      {
        pathFormat: 'array',
      }
    );
    expect(filtrate).to.deep.equal([
      {
        value: 'Miss1',
        children: [{ value: 'Hit1', children: [{ value: 'Miss3' }] }],
      },
      {
        value: 'Miss4',
        children: [{ value: 'Miss6', children: [{ value: 'Hit2' }] }],
      },
      {
        value: 'Hit3',
        children: [
          { value: 'Miss11' },
          { value: 'Miss12', children: [{ value: 'Miss13' }] },
        ],
      },
      {
        value: 'Miss14',
        children: [{ value: 'Hit4' }],
      },
    ]);
  });
  it('keepUndefined', () => {
    let filtrate = _.filterDeep(
      demo,
      (v, k, o, c) => {
        if (k == 'i' && v == 3) return false;
        if (_.endsWith(c.path, 'o.d')) return false;
        if (_.endsWith(c.path, 'o.f')) return false;
      },
      {
        leafsOnly: false,
        keepUndefined: true,
      }
    );
    // console.log(filtrate);
    expect(filtrate).to.deep.equal({
      a: {
        b: {
          c: {
            d: [
              { i: 0 },
              { i: 1 },
              { i: 2 },
              {},
              { i: 4 },
              { i: 5 },
              {
                o: {
                  skip: { please: { dont: { go: { here: 'skip it' } } } },
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
    });
  });
});
