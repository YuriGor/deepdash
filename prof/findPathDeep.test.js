'use strict';

var { validateIteration, forLodashes, it, expect } = require('./common.js');

var { demo, circular } = require('./object')();

forLodashes(['findPathDeep', 'omitDeep', 'paths'], (_) => {
  function isNS(options = {}) {
    return (value, key, parent, ctx) => {
      // console.log(`@${ctx.path}`);
      options = _.merge({ method: 'findPathDeep' }, options);
      validateIteration(value, key, parent, ctx, options);
      let t = typeof value;
      return t == 'number' || t == 'string';
    };
  }

  it('find path object - defaults', () => {
    let found = _.findPathDeep(demo, isNS());
    expect(found);
  });

  it('find path array - defaults', () => {
    let found = _.findPathDeep([demo], isNS());
    expect(found);
  });

  it('find path object - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findPathDeep(demo, isNS(options), options);
    expect(found);
  });

  it('find path array - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findPathDeep([demo], isNS(options), options);
    expect(found);
  });

  it('find path array - not leavesOnly, includeRoot', () => {
    let options = {
      leavesOnly: false,
      includeRoot: true,
    };
    let found = _.findPathDeep([demo], isNS(options), options);
    expect(found);
  });

  it('not found === undefined', () => {
    let obj = { a: { b: undefined } };
    let found = _.findPathDeep(obj, isNS());
    expect(found);
    obj = [{ a: { b: false } }];
    found = _.findPathDeep(obj, isNS());
    expect(found);
  });

  it('I dunno', () => {
    let found = _.findPathDeep(demo, (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );

    expect(found);
    found = _.findPathDeep([demo], (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );
    expect(found);
  });
  if (!_.v) {
    it('Chaining', () => {
      let options = {
        leafsOnly: false,
      };
      let found = _(demo)
        .filterDeep(isNS())
        .findPathDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx, options);
          return key === 'skip';
        }, options)
        .value();
      expect(found);
    });
  }

  it('non-object', () => {
    expect(
      _.findPathDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findPathDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findPathDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findPathDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findPathDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findPathDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findPathDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findPathDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let options = { includeRoot: true };
    expect(
      _.findPathDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      )
    );

    expect(
      _.findPathDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );
    let f = () => {};
    expect(
      _.findPathDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let dt = new Date();
    expect(
      _.findPathDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let rx = /.*/;
    expect(
      _.findPathDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let sm = Symbol('Halloo');
    expect(
      _.findPathDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findPathDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );
  });

  it('Circular', () => {
    let options = {
      checkCircular: true,
      leavesOnly: false,
    };
    let found = _.findPathDeep(circular, 'hi', options);
    expect(found);
  });

  it('Sparse array', () => {
    // eslint-disable-next-line  no-sparse-arrays
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    var found = _.findPathDeep(obj, (v) => v === true);
    expect(found);
  });
});
