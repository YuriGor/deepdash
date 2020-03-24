'use strict';

var { validateIteration, forLodashes, it, expect } = require('./common.js');

var { demo, circular } = require('./object')();

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

    expect(found);
  });

  it('find array - defaults', () => {
    let found = _.findValueDeep([demo], isNS());

    expect(found);
  });

  it('find object - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findValueDeep(demo, isNS(options), options);

    expect(found);
  });

  it('find array - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findValueDeep([demo], isNS(options), options);

    expect(found);
  });

  it('find array - not leavesOnly, includeRoot', () => {
    let options = {
      leavesOnly: false,
      includeRoot: true,
    };
    let found = _.findValueDeep([demo], isNS(options), options);

    expect(found);
  });

  it('not found === undefined', () => {
    let obj = { a: { b: undefined } };
    expect(_.findValueDeep(obj, isNS()));

    obj = [{ a: { b: false } }];
    expect(_.findValueDeep(obj, isNS()));
  });

  it('I dunno', () => {
    expect(
      _.findValueDeep(demo, (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx)
      )
    );

    expect(
      _.findValueDeep([demo], (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx)
      )
    );
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

      expect(found);
    });
  }

  it('non-object', () => {
    expect(
      _.findValueDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findValueDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findValueDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findValueDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findValueDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findValueDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findValueDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findValueDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let options = { includeRoot: true };
    expect(
      _.findValueDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      )
    );

    expect(
      _.findValueDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );
    let f = () => {};
    expect(
      _.findValueDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let dt = new Date();
    expect(
      _.findValueDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let rx = /.*/;
    expect(
      _.findValueDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let sm = Symbol('Halloo');
    expect(
      _.findValueDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findValueDeep(
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
    let found = _.findValueDeep(circular, 'hi', options);
    expect(found.hi);
  });

  it('Sparse array', () => {
    // eslint-disable-next-line  no-sparse-arrays
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    expect(
      _.findValueDeep(obj, (v, k, p, ctx) => k === '3', { leavesOnly: false })
    );
  });
});
