'use strict';

var { validateIteration, forLodashes, it, expect } = require('./common.js');

var { demo, circular } = require('./object')();

forLodashes(['findDeep', 'omitDeep', 'paths'], (_) => {
  function isNS(options = {}) {
    return (value, key, parent, ctx) => {
      // console.log(`@${ctx.path}`);
      options = _.merge({ method: 'findDeep' }, options);
      validateIteration(value, key, parent, ctx, options);
      let t = typeof value;
      return t == 'number' || t == 'string';
    };
  }

  it('find object - defaults', () => {
    let found = _.findDeep(demo, isNS());

    expect(found);
    expect(found.value);
    expect(found.key);
    expect(found.parent);
    expect(found.context.path);
  });

  it('find array - defaults', () => {
    let found = _.findDeep([demo], isNS());
    expect(found);
    expect(found.value);
    expect(found.key);
    expect(found.parent);
    expect(found.context.path);
  });

  it('find object - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findDeep(demo, isNS(options), options);
    expect(found);
    expect(found.value);
    expect(found.key);
    expect(found.parent);
    expect(found.context.path);
  });

  it('find array - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findDeep([demo], isNS(options), options);
    expect(found);
    expect(found.value);
    expect(found.key);
    expect(found.parent);
    expect(found.context.path);
  });

  it('find array - not leavesOnly, includeRoot', () => {
    let options = {
      leavesOnly: false,
      includeRoot: true,
    };
    let found = _.findDeep([demo], isNS(options), options);
    expect(found);
    expect(found.value);
    expect(found.key);
    expect(found.parent);
    expect(found.context.path);
  });

  it('not found === undefined', () => {
    let obj = { a: { b: undefined } };
    let found = _.findDeep(obj, isNS());
    expect(found);
    obj = [{ a: { b: false } }];
    found = _.findDeep(obj, isNS());
    expect(found);
  });

  it('I dunno', () => {
    let found = _.findDeep(demo, (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );

    expect(found);
    found = _.findDeep([demo], (value, key, parent, ctx) =>
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
        .findDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx, options);
          return key === 'skip';
        }, options)
        .value();
      expect(found);
      expect(found.value);
      expect(found.key);
      expect(found.parent);
      expect(found.context.path);
    });
  }

  it('non-object', () => {
    expect(
      _.findDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.findDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let options = { includeRoot: true };
    expect(
      _.findDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      ).value
    );

    expect(
      _.findDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.findDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );
    let f = () => {};
    expect(
      _.findDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let dt = new Date();
    expect(
      _.findDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let rx = /.*/;
    expect(
      _.findDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let sm = Symbol('Halloo');
    expect(
      _.findDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    );
    expect(
      _.findDeep(
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
    let found = _.findDeep(circular, 'hi', options);
    expect(found.value.hi);
  });

  it('Sparse array', () => {
    // eslint-disable-next-line  no-sparse-arrays
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    var found = _.findDeep(obj, (v) => v === true);
    expect(found.context.path);
  });
});
