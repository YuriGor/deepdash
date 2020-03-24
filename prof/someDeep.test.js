'use strict';

var { validateIteration, forLodashes, it, expect } = require('./common.js');

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

    expect(found);
  });

  it('some in array - defaults', () => {
    let found = _.someDeep([demo], isNS());

    expect(found);
  });

  it('some in object - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.someDeep(demo, isNS(options), options);

    expect(found);
  });

  it('some in array - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.someDeep([demo], isNS(options), options);

    expect(found);
  });

  it('some in array - not leavesOnly, includeRoot', () => {
    let options = {
      leavesOnly: false,
      includeRoot: true,
    };
    let found = _.someDeep([demo], isNS(options), options);

    expect(found);
  });

  it('not found === false', () => {
    let obj = { a: { b: undefined } };
    expect(_.someDeep(obj, isNS()));

    obj = [{ a: { b: false } }];
    expect(_.someDeep(obj, isNS()));
  });

  it('I dunno', () => {
    expect(
      _.someDeep(demo, (value, key, parent, ctx) =>
        validateIteration(value, key, parent, ctx)
      )
    );

    expect(
      _.someDeep([demo], (value, key, parent, ctx) =>
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
        .someDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx, options);
          return key === 'skip';
        }, options)
        .value();

      expect(found);
    });
  }

  it('non-object', () => {
    expect(
      _.someDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.someDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.someDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.someDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.someDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.someDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.someDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.someDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let options = { includeRoot: true };
    expect(
      _.someDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      )
    );

    expect(
      _.someDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );
    let f = () => {};
    expect(
      _.someDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let dt = new Date();
    expect(
      _.someDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let rx = /.*/;
    expect(
      _.someDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let sm = Symbol('Halloo');
    expect(
      _.someDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.someDeep(
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
    let found = _.someDeep(circular, 'hi', options);
    expect(found);
  });

  it('Sparse array', () => {
    // eslint-disable-next-line  no-sparse-arrays
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    expect(
      _.someDeep(obj, (v, k, p, ctx) => k === '3' && !v.b, {
        leavesOnly: false,
      })
    );
  });
});
