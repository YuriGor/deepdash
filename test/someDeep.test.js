'use strict';

const chai = require('chai'),
  expect = chai.expect;

const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { validateIteration, forLodashes } = require('./common.js');

var { demo, circular } = require('./object')();

forLodashes(['someDeep', 'omitDeep', 'paths'], (_) => {
  function isNS(options = {}) {
    return (value, key, parent, ctx) => {
      // console.log(`@${ctx.path}`);
      options = _.merge({ method: 'someDeep' }, options);
      validateIteration(value, key, parent, ctx, options);
      let t = typeof value;
      return t == 'number' || t == 'string';
    };
  }

  it('some in object - defaults', () => {
    let found = _.someDeep(demo, isNS());

    expect(found).to.be.true;
  });

  it('some in array - defaults', () => {
    let found = _.someDeep([demo], isNS());

    expect(found).to.be.true;
  });

  it('some in object - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.someDeep(demo, isNS(options), options);

    expect(found).to.be.true;
  });

  it('some in array - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.someDeep([demo], isNS(options), options);

    expect(found).to.be.true;
  });

  it('some in array - not leavesOnly, includeRoot', () => {
    let options = {
      leavesOnly: false,
      includeRoot: true,
    };
    let found = _.someDeep([demo], isNS(options), options);

    expect(found).to.be.true;
  });

  it('not found === false', () => {
    let obj = { a: { b: undefined } };
    expect(_.someDeep(obj, isNS())).to.be.false;

    obj = [{ a: { b: false } }];
    expect(_.someDeep(obj, isNS())).to.be.false;
  });

  it('I dunno', () => {
    expect(
      _.someDeep(demo, (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx)
      )
    ).to.be.false;

    expect(
      _.someDeep([demo], (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx)
      )
    ).to.be.false;
  });
  if (!_.v) {
    it('Chaining', () => {
      let options = {
        leafsOnly: false,
      };
      let found = _(demo)
        .filterDeep(isNS())
        .someDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx, options);
          return key === 'skip';
        }, options)
        .value();

      expect(found).to.be.true;
    });
  }

  it('non-object', () => {
    expect(
      _.someDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    expect(
      _.someDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    expect(
      _.someDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    expect(
      _.someDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    expect(
      _.someDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    expect(
      _.someDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    expect(
      _.someDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    expect(
      _.someDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    let options = { includeRoot: true };
    expect(
      _.someDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      )
    ).to.be.true;

    expect(
      _.someDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.false;
    expect(
      _.someDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;
    let f = () => {};
    expect(
      _.someDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    let dt = new Date();
    expect(
      _.someDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    let rx = /.*/;
    expect(
      _.someDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;

    let sm = Symbol('Halloo');
    expect(
      _.someDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.be.true;
    expect(
      _.someDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.be.false;
  });

  it('Circular', () => {
    let options = {
      checkCircular: true,
      leavesOnly: false,
    };
    let found = _.someDeep(circular, 'hi', options);
    expect(found).to.be.true;
  });

  it('Sparse array', () => {
    // eslint-disable-next-line  no-sparse-arrays
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    expect(
      _.someDeep(obj, (v, k, p, ctx) => k === '3' && !v.b, {
        leavesOnly: false,
      })
    ).to.be.true;
  });
});
