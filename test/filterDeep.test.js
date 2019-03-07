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
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.filterDeep(obj, isNS, { leavesOnly: true });
    expect(obj).to.deep.equal(orig);
  });
  it('Count paths', () => {
    let filtrate = _(demo)
      .filterDeep(isNS, { leavesOnly: true })
      .indexate({ leavesOnly: true })
      .value();
    // console.log(_.filterDeep(demo, isNS));
    expect(_.size(filtrate)).equal(9);
  });
  it('Array', () => {
    let filtrate = _.filterDeep([demo, demo], isNS, { leavesOnly: true });
    expect(filtrate).to.be.an('array');
    filtrate = _.indexate(filtrate, { leavesOnly: true });
    expect(_.size(filtrate)).equal(18);
  });
  it('Completely filtered out', () => {
    let obj = { a: { b: undefined } };
    let filtrate = _.filterDeep(obj, isNS, {
      leavesOnly: true,
    });
    //console.log(filtrate);
    expect(filtrate).to.deep.equal({});
  });
  it('Count paths circular', () => {
    let filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leavesOnly: true,
    });
    // console.log(circular);
    // console.log(filtrate);
    filtrate = _.paths(filtrate, {
      leavesOnly: true,
      checkCircular: true,
    });
    // console.log(filtrate);
    expect(_.size(filtrate)).equal(11);
  });
  it('Chaining', () => {
    let filtrate = _(demo)
      .filterDeep(isNS, { leafsOnly: true })
      .paths({ leavesOnly: true })
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
        leavesOnly: false,
        onTrue: { skipChildren: false },
      })
      .omitDeep('o.d', { onMatch: {} })
      .value();
    // console.log(JSON.stringify(filtrate));
    expect(filtrate).to.deep.equal({
      a: {
        b: {
          c: {
            d: [
              {},
              {},
              {},
              {},
              {},
              {},
              {
                o: {
                  f: {},
                  skip: { please: { dont: { go: {} } } },
                },
              },
            ],
          },
        },
      },
    });
  });
  it('Circular', () => {
    let filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leavesOnly: true,
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
      leavesOnly: true,
    });
    let err;
    try {
      JSON.stringify(filtrate);
    } catch (exc) {
      err = exc;
    }
    expect(err).equal(undefined);
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
      leavesOnly: true,
    });
    // console.log(filtrate);
    filtrate.should.not.have.property('x');
  });
  it('Sparse array', () => {
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    var filtrate = _.filterDeep(obj, (v) => v === true, { leavesOnly: true });
    filtrate.should.deep.equal({ a: [{ b: true }] });
    filtrate = _.filterDeep(obj, (v) => v === true, {
      leavesOnly: true,
      condense: false,
    });
    // console.log(filtrate);
    filtrate.should.deep.equal({ a: [, , { b: true }, ,] });
  });
  it('replaceCircularBy', () => {
    let again = Symbol('[circular]');
    let filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leavesOnly: true,
      replaceCircularBy: again,
    });
    // console.log(filtrate);
    filtrate.should.have.nested.property('a.b.c.e').and.equal(again);
    filtrate.should.have.nested.property('i[5][0]').and.equal(again);
    filtrate.should.have.nested.property('i[5][1][0].b.c.e').and.equal(again);
    filtrate = _.filterDeep(circular, isNS, {
      checkCircular: true,
      leavesOnly: true,
      replaceCircularBy: undefined,
    });
    // console.log(filtrate);
    filtrate.should.have.nested.property('a.b.c.e').and.equal(undefined);
    filtrate.should.have.nested.property('i[5][0]').and.equal(undefined);
    filtrate.should.have.nested
      .property('i[5][1][0].b.c.e')
      .and.equal(undefined);
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
        leavesOnly: false,
        onUndefined: { keepIfEmpty: true },
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
  it('Custom reply', () => {
    let filtrate = _.filterDeep(demo, (v) => {
      if (v instanceof Date) {
        return {
          cloneDeep: false,
          keepIfEmpty: false,
          skipChildren: true,
          empty: true,
        };
      }
      let t = typeof v;
      if (t == 'object') {
        return { cloneDeep: false, keepIfEmpty: true };
      }
      if (t == 'string' || t == 'number') return true;
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).to.deep.equal({
      a: {
        b: {
          c: {
            d: [
              {
                i: 0,
              },
              {
                i: 1,
              },
              {
                i: 2,
              },
              {
                i: 3,
              },
              {
                i: 4,
              },
              {
                i: 5,
              },
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
            s: 'hello',
          },
        },
        n: 12345,
      },
      nl: null,
    });
  });
});
