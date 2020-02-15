'use strict';

const chai = require('chai'),
  expect = chai.expect;

const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { validateIteration, forLodashes } = require('./common.js');

var { demo, circular } = require('./object');

forLodashes(['findValueDeep', 'omitDeep', 'paths'], (_) => {
  function isNS(options = {}) {
    return (value, key, parent, ctx) => {
      // console.log(`@${ctx.path}`);
      options = _.merge({ method: 'findValueDeep' }, options);
      validateIteration(value, key, parent, ctx, options);
      let t = typeof value;
      return t == 'number' || t == 'string';
    };
  }

  it('find object - defaults', () => {
    let found = _.findValueDeep(demo, isNS());

    expect(found).equal(0);
  });

  it('find array - defaults', () => {
    let found = _.findValueDeep([demo], isNS());

    expect(found).equal(0);
  });

  it('find object - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findValueDeep(demo, isNS(options), options);

    expect(found).equal(0);
  });

  it('find array - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findValueDeep([demo], isNS(options), options);

    expect(found).equal(0);
  });

  it('find array - not leavesOnly, includeRoot', () => {
    let options = {
      leavesOnly: false,
      includeRoot: true,
    };
    let found = _.findValueDeep([demo], isNS(options), options);

    expect(found).equal(0);
  });

  it('not found === undefined', () => {
    let obj = { a: { b: undefined } };
    expect(_.findValueDeep(obj, isNS())).equal(undefined);

    obj = [{ a: { b: false } }];
    expect(_.findValueDeep(obj, isNS())).equal(undefined);
  });

  it('I dunno', () => {
    expect(
      _.findValueDeep(demo, (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx)
      )
    ).equal(undefined);

    expect(
      _.findValueDeep([demo], (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx)
      )
    ).equal(undefined);
  });
  if (!_.v) {
    it('Chaining', () => {
      let options = {
        leafsOnly: false,
      };
      let found = _(demo)
        .filterDeep(isNS())
        .findValueDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx, options);
          return key === 'skip';
        }, options)
        .value();

      expect(found).deep.equal({
        please: {
          dont: {
            go: {
              here: 'skip it',
            },
          },
        },
      });
    });
  }

  it('non-object', () => {
    expect(
      _.findValueDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(true);
    expect(
      _.findValueDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    expect(
      _.findValueDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(false);
    expect(
      _.findValueDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    expect(
      _.findValueDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(null);
    expect(
      _.findValueDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    expect(
      _.findValueDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(undefined);
    expect(
      _.findValueDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    expect(
      _.findValueDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(1);
    expect(
      _.findValueDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    expect(
      _.findValueDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(0);
    expect(
      _.findValueDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    expect(
      _.findValueDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal('hi');
    expect(
      _.findValueDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    expect(
      _.findValueDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).deep.equal({});
    expect(
      _.findValueDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    let options = { includeRoot: true };
    expect(
      _.findValueDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      )
    ).deep.equal([]);

    expect(
      _.findValueDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(undefined);
    expect(
      _.findValueDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);
    let f = () => {};
    expect(
      _.findValueDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.equal(f);
    expect(
      _.findValueDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    let dt = new Date();
    expect(
      _.findValueDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(dt);
    expect(
      _.findValueDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    let rx = /.*/;
    expect(
      _.findValueDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(rx);
    expect(
      _.findValueDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);

    let sm = Symbol('Halloo');
    expect(
      _.findValueDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).equal(sm);
    expect(
      _.findValueDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).equal(undefined);
  });

  it('Circular', () => {
    let options = {
      checkCircular: true,
      leavesOnly: false,
    };
    let found = _.findValueDeep(circular, 'hi', options);
    expect(found.hi).equal('planet');
  });

  it('Sparse array', () => {
    // eslint-disable-next-line  no-sparse-arrays
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    expect(
      _.findValueDeep(obj, (v, k, p, ctx) => k === '3', { leavesOnly: false })
    ).deep.equal({ b: false });
  });
});
