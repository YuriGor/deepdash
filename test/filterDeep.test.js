'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');

const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { validateIteration, forLodashes } = require('./common.js');

var { demo, circular } = require('./object');
function isNS(options = {}) {
  return (value, key, parent, ctx) => {
    // console.log(`@${ctx.path}`);
    options.method = 'filterDeep';
    validateIteration(value, key, parent, ctx, options);
    let t = typeof value;
    return t == 'number' || t == 'string';
  };
}

forLodashes(['filterDeep', 'omitDeep', 'paths'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.filterDeep(obj, isNS());
    expect(obj).to.deep.equal(orig);
  });
  if (!_.v) {
    it('filter object - defaults', () => {
      let filtrate = _(demo)
        .filterDeep(isNS())
        .value();
      expect(JSON.stringify(filtrate)).equal(
        '{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}'
      );
    });
  }
  it('filter object - no clone', () => {
    let options = { cloneDeep: false };
    let filtrate = _.filterDeep(demo, isNS(options), options);
    expect(JSON.stringify(filtrate)).equal(
      '{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}'
    );
  });

  it('filter array - no clone', () => {
    let options = { cloneDeep: false };
    let filtrate = _.filterDeep([demo], isNS(options), options);
    expect(JSON.stringify(filtrate)).equal(
      '[{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}]'
    );
  });

  it('filter object - no clone, not leavesOnly', () => {
    let options = {
      cloneDeep: false,
      leavesOnly: false,
      onFalse: { skipChildren: false },
    };
    let filtrate = _.filterDeep(demo, isNS(options), options);
    expect(JSON.stringify(filtrate)).equal(
      '{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}'
    );
  });

  it('filter object - no clone, not leafsOnly', () => {
    let options = {
      cloneDeep: false,
      leafsOnly: false,
      onFalse: { skipChildren: false },
    };
    let filtrate = _.filterDeep(demo, isNS(options), options);
    expect(JSON.stringify(filtrate)).equal(
      '{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}'
    );
  });

  it('filter array - no clone, not leavesOnly', () => {
    let options = {
      cloneDeep: false,
      leavesOnly: false,
      onFalse: { skipChildren: false },
    };
    let filtrate = _.filterDeep([demo], isNS(options), options);
    expect(JSON.stringify(filtrate)).equal(
      '[{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}]'
    );
  });

  it('filter array - no clone, not leavesOnly, includeRoot', () => {
    let options = {
      cloneDeep: false,
      leavesOnly: false,
      onFalse: { skipChildren: false },
      includeRoot: true,
    };
    let filtrate = _.filterDeep([demo], isNS(options), options);
    expect(JSON.stringify(filtrate)).equal(
      '[{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}]'
    );
  });

  it('filter object -  array', () => {
    let filtrate = _.filterDeep([demo, demo], isNS());
    expect(filtrate).to.be.an('array');
    expect(JSON.stringify(filtrate)).equal(
      '[{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}},{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{"skip":{"please":{"dont":{"go":{"here":"skip it"}}}}}}],"s":"hello"}},"n":12345}}]'
    );
  });
  it('Completely filtered out', () => {
    let obj = { a: { b: undefined } };
    let filtrate = _.filterDeep(obj, isNS());
    //console.log(filtrate);
    expect(filtrate).to.deep.equal(null);
    obj = [{ a: { b: undefined } }];
    filtrate = _.filterDeep(obj, isNS());
    //console.log(filtrate);
    expect(filtrate).to.deep.equal(null);
  });

  it('I dunno', () => {
    let filtrate = _.filterDeep(demo, (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );
    //console.log(filtrate);
    expect(filtrate).equal(null);
    filtrate = _.filterDeep([demo], (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );
    //console.log(filtrate);
    expect(filtrate).equal(null);
  });
  if (!_.v) {
    it('Chaining', () => {
      let options = {
        leafsOnly: false,
        onTrue: { skipChildren: false },
      };
      let filtrate = _(demo)
        .filterDeep(isNS())
        .filterDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx, options);
          return key !== 'skip';
        }, options)
        .value();
      expect(JSON.stringify(filtrate)).equal(
        '{"a":{"b":{"c":{"d":[{"i":0},{"i":1},{"i":2},{"i":3},{"i":4},{"i":5},{"o":{}}],"s":"hello"}},"n":12345}}'
      );
    });
  }

  it('non-object', () => {
    expect(
      _.filterDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(true);
    expect(
      _.filterDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(false);
    expect(
      _.filterDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(null);
    expect(
      _.filterDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(undefined);
    expect(
      _.filterDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(1);
    expect(
      _.filterDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(0);
    expect(
      _.filterDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal('hi');
    expect(
      _.filterDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal({});
    expect(
      _.filterDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    let options = { includeRoot: true };
    expect(
      _.filterDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      )
    ).to.deep.equal([]);

    expect(
      _.filterDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(null);
    expect(
      _.filterDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    expect(
      _.filterDeep(
        () => {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal({});
    expect(
      _.filterDeep(
        () => {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    let dt = new Date();
    expect(
      _.filterDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(dt);
    expect(
      _.filterDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    let rx = /.*/;
    expect(
      _.filterDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(rx);
    expect(
      _.filterDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);

    let sm = Symbol('Halloo');
    expect(
      _.filterDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(sm);
    expect(
      _.filterDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(null);
  });

  it('Obj only', () => {
    let filtrate = _.filterDeep(
      demo,
      (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx) || _.isObject(value),
      {
        leavesOnly: false,
        onTrue: { skipChildren: false },
      }
    );
    filtrate = _.omitDeep(filtrate, 'o.d', { onMatch: {} });
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
    let options = {
      checkCircular: true,
      leavesOnly: true,
    };
    let filtrate = _.filterDeep(circular, isNS(options), options);

    filtrate.should.have.nested.property('a.b.c.e').and.equal(filtrate.a.b);
    filtrate.should.have.nested.property('i[5][0]').and.equal(filtrate);
    filtrate.should.have.nested
      .property('i[5][1][0].b.c.e')
      .and.equal(filtrate.i[5][1][0].b);

    filtrate = _.paths(filtrate, options);

    expect(filtrate).to.deep.equal([
      'a.b.c.hi',
      'a.b.c.e',
      'i[0]',
      'i[1]',
      'i[2]',
      'i[3]',
      'i[4].hello',
      'i[5][0]',
      'i[5][1][0].b.c.hi',
      'i[5][1][0].b.c.e',
      'i[5][2].j.hello',
    ]);
  });

  it("Don't keep circular", () => {
    let options = {
      checkCircular: true,
      keepCircular: false,
      leavesOnly: true,
    };
    let filtrate = _.filterDeep(circular, isNS(options), options);
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
    let options = {
      checkCircular: true,
      leavesOnly: true,
    };
    let filtrate = _.filterDeep(obj, isNS(options), options);
    // console.log(filtrate);
    filtrate.should.not.have.property('x');
  });
  it('Sparse array', () => {
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    var filtrate = _.filterDeep(obj, (v) => v === true);
    filtrate.should.deep.equal({ a: [{ b: true }] });
    filtrate = _.filterDeep(obj, (v) => v === true, {
      condense: false,
    });
    // console.log(filtrate);
    filtrate.should.deep.equal({ a: [, , { b: true }] });
  });
  it('replaceCircularBy', () => {
    let again = Symbol('[circular]');
    let options = {
      checkCircular: true,
      leavesOnly: true,
      replaceCircularBy: again,
    };
    let filtrate = _.filterDeep(circular, isNS(options), options);
    // console.log(filtrate);
    filtrate.should.have.nested.property('a.b.c.e').and.equal(again);
    filtrate.should.have.nested.property('i[5][0]').and.equal(again);
    filtrate.should.have.nested.property('i[5][1][0].b.c.e').and.equal(again);
    options = {
      checkCircular: true,
      leavesOnly: true,
      replaceCircularBy: undefined,
    };
    filtrate = _.filterDeep(circular, isNS(options), options);
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
