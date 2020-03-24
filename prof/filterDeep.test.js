'use strict';

var { validateIteration, forLodashes, it, expect } = require('./common.js');

var { demo, circular } = require('./object')();

forLodashes(['filterDeep', 'omitDeep', 'paths'], (_) => {
  function isNS(options = {}) {
    return (value, key, parent, ctx) => {
      // console.log(`@${ctx.path}`);
      options = _.merge({ method: 'filterDeep' }, options);
      validateIteration(value, key, parent, ctx, options);
      let t = typeof value;
      return t == 'number' || t == 'string';
    };
  }
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.filterDeep(obj, isNS());
    expect(obj);
  });
  if (!_.v) {
    it('filter object - defaults', () => {
      let filtrate = _(demo)
        .filterDeep(isNS())
        .value();
      // console.log(filtrate);
      expect(JSON.stringify(filtrate));
    });
  }
  it('filter object - no clone', () => {
    let options = { cloneDeep: false };
    let filtrate = _.filterDeep(demo, isNS(options), options);
    expect(JSON.stringify(filtrate));
  });

  it('filter array - no clone', () => {
    let options = { cloneDeep: false };
    let filtrate = _.filterDeep([demo], isNS(options), options);
    expect(JSON.stringify(filtrate));
  });

  it('filter object - no clone, not leavesOnly', () => {
    let options = {
      cloneDeep: false,
      leavesOnly: false,
      onFalse: { skipChildren: false },
    };
    let filtrate = _.filterDeep(demo, isNS(options), options);
    expect(JSON.stringify(filtrate));
  });

  it('filter object - no clone, not leafsOnly', () => {
    let options = {
      cloneDeep: false,
      leafsOnly: false,
      onFalse: { skipChildren: false },
    };
    let filtrate = _.filterDeep(demo, isNS(options), options);
    expect(JSON.stringify(filtrate));
  });

  it('filter array - no clone, not leavesOnly', () => {
    let options = {
      cloneDeep: false,
      leavesOnly: false,
      onFalse: { skipChildren: false },
    };
    let filtrate = _.filterDeep([demo], isNS(options), options);
    expect(JSON.stringify(filtrate));
  });

  it('filter array - no clone, not leavesOnly, includeRoot', () => {
    let options = {
      cloneDeep: false,
      leavesOnly: false,
      onFalse: { skipChildren: false },
      includeRoot: true,
    };
    let filtrate = _.filterDeep([demo], isNS(options), options);
    expect(JSON.stringify(filtrate));
  });

  it('filter object -  array', () => {
    let filtrate = _.filterDeep([demo, demo], isNS());
    expect(filtrate);
    expect(JSON.stringify(filtrate));
  });
  it('Completely filtered out', () => {
    let obj = { a: { b: undefined } };
    let filtrate = _.filterDeep(obj, isNS());
    //console.log(filtrate);
    expect(filtrate);
    obj = [{ a: { b: undefined } }];
    filtrate = _.filterDeep(obj, isNS());
    //console.log(filtrate);
    expect(filtrate);
  });

  it('I dunno', () => {
    let filtrate = _.filterDeep(demo, (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );
    //console.log(filtrate);
    expect(filtrate);
    filtrate = _.filterDeep([demo], (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );
    //console.log(filtrate);
    expect(filtrate);
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
      expect(JSON.stringify(filtrate));
    });
  }

  it('non-object', () => {
    expect(
      _.filterDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let options = { includeRoot: true };
    expect(
      _.filterDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      )
    );

    expect(
      _.filterDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    expect(
      _.filterDeep(
        () => {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        () => {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let dt = new Date();
    expect(
      _.filterDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let rx = /.*/;
    expect(
      _.filterDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );

    let sm = Symbol('Halloo');
    expect(
      _.filterDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    );
    expect(
      _.filterDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    );
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
    expect(filtrate);
  });
  it('Circular', () => {
    let options = {
      checkCircular: true,
      leavesOnly: true,
    };
    let filtrate = _.filterDeep(circular, isNS(options), options);

    filtrate = _.paths(filtrate, options);

    expect(filtrate);
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
    expect(err);
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
  });
  it('Sparse array', () => {
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    var filtrate = _.filterDeep(obj, (v) => v === true);
    filtrate.should;
    filtrate = _.filterDeep(obj, (v) => v === true, {
      condense: false,
    });
    // console.log(filtrate);
    let karrekt = { a: [, , { b: true }, 'x'] };
    delete karrekt.a[3];
    filtrate.should;
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

    options = {
      checkCircular: true,
      leavesOnly: true,
      replaceCircularBy: undefined,
    };
    filtrate = _.filterDeep(circular, isNS(options), options);
    // console.log(filtrate);
  });
  it('keep empty parents', () => {
    let data = {
      x: {
        x: {},
        y: ['aaaa', 'bbbb'],
        a: 'aaaa',
        b: 'bbbb',
      },
      y: [
        'aaaa',
        'bbbb',
        {
          x: {},
          y: ['aaaa', 'bbbb'],
          a: 'aaaa',
          b: 'bbbb',
        },
      ],
      a: 'aaaa',
      b: 'bbbb',
    };
    let filtrate = _.filterDeep(
      data,
      (v) => (_.isString(v) ? v.includes('a') : undefined),
      {
        onUndefined: { keepIfEmpty: true },
      }
    );
    expect(filtrate);
    // console.log('---');
    filtrate = _.filterDeep(
      data,
      (v, k, p, c) => {
        // console.log(c.path, _.isString(v) ? v.includes('Ё') : undefined, v);
        return _.isString(v) ? v.includes('Ё') : undefined;
      },
      {
        onUndefined: { keepIfEmpty: true },
      }
    );
    expect(filtrate);
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
    expect(filtrate);
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
    expect(filtrate);
  });
});
