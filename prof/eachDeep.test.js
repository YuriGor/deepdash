'use strict';

var { demo, circular } = require('./object')();
var { validateIteration, forLodashes, it, expect } = require('./common.js');

forLodashes(['eachDeep', 'forEachDeep', 'pathToString'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.eachDeep(obj, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      if (key == 'skip') return false;
    });
    expect(obj);
  });
  it('eachDeep defaults', () => {
    let keys = [];
    _.eachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return false;
    });

    expect(JSON.stringify(keys));
  });
  it('eachDeep break', () => {
    let keys = [];
    _.eachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return ctx.break();
    });

    expect(JSON.stringify(keys));
  });

  it('eachDeep break for childs', () => {
    let keys = [];
    _.eachDeep(
      demo,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx);
        keys.push(key);
        if (value.i == 3) return ctx.break();
      },
      { leavesOnly: false }
    );

    expect(JSON.stringify(keys));
  });

  it('eachDeep - path in error', () => {
    let keys = [];
    try {
      _.eachDeep(demo, (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx);
        keys.push(key);
        if (key == 'skip') throw new Error('Enough!');
      });
    } catch (err) {
      expect(err.message);
    }
    expect(JSON.stringify(keys));

    keys = [];
    try {
      _.eachDeep(
        demo,
        (value, key, parent, ctx) => {
          if (!ctx.afterIterate) {
            validateIteration(value, key, parent, ctx);
            keys.push(key);
          } else {
            if (key == 'skip') throw new Error('Enough!');
          }
        },
        { callbackAfterIterate: true }
      );
    } catch (err) {
      expect(err.message);
    }
    expect(JSON.stringify(keys));
  });

  it('eachDeep - no path in not an error', () => {
    let keys = [];
    try {
      _.eachDeep(demo, (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx);
        keys.push(key);
        if (key == 'skip') throw 'Enough!';
      });
    } catch (err) {
      expect(err);
    }
    expect(JSON.stringify(keys));

    keys = [];
    try {
      _.eachDeep(
        demo,
        (value, key, parent, ctx) => {
          if (!ctx.afterIterate) {
            validateIteration(value, key, parent, ctx);
            keys.push(key);
          } else {
            if (key == 'skip') throw 'Enough!';
          }
        },
        { callbackAfterIterate: true }
      );
    } catch (err) {
      expect(err);
    }
    expect(JSON.stringify(keys));
  });

  if (!_.v) {
    it('Chaining', () => {
      let keys = [];
      _(demo)
        .eachDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx);
          keys.push(key);
          if (key == 'skip') return false;
        })
        .value();
      expect(JSON.stringify(keys));
    });
  }
  it('alias forEachDeep', () => {
    let keys = [];
    _.forEachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
    });
    expect(JSON.stringify(keys));
  });
  it('returns collection', () => {
    let c = _.forEachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
    });
    expect(c);
  });
  it('no callback', () => {
    let c = _.forEachDeep(demo);
    expect(c);
    if (!_.v) {
      c = _(demo)
        .forEachDeep()
        .value();
      expect(c);
    }
  });

  it('circular', () => {
    let circluarPath = [];
    let options = { checkCircular: true };
    _.eachDeep(
      circular,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.isCircular) {
          circluarPath.push(ctx.path);

          return false;
        }
      },
      options
    );
    expect(JSON.stringify(circluarPath));
  });

  it('circular with array path format', () => {
    let circluarPath = [];
    let options = { checkCircular: true, pathFormat: 'array' };
    _.eachDeep(
      circular,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        ctx.parents.forEach((p, i) => {
          if (i) {
            expect(p.path);
          } else {
            expect(p.path);
          }
        });
        if (ctx.isCircular) {
          circluarPath.push(_.pathToString(ctx.path));
          return false;
        }
      },
      options
    );
    expect(JSON.stringify(circluarPath));
  });

  it('Array', () => {
    let keys = [];
    _.eachDeep([demo, demo], (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return false;
    });
    expect(JSON.stringify(keys));
  });

  it('String', () => {
    let paths = [];
    _.eachDeep('Hello?', (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths);
  });

  it('empty props', () => {
    let paths = [];
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    _.eachDeep(o, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths);
    paths = [];
    var a = ['a', 'b', 'c'];
    delete a[1];
    _.eachDeep(a, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths);
    paths = [];
    var slots = ['start', , 'middle', , 'finish'];
    _.eachDeep(slots, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths);
  });
  it('generated string paths are correct', () => {
    _.eachDeep(demo, function(value, key, parent, ctx) {
      validateIteration(value, key, parent, ctx);
    });
  });
  it('generated array paths are correct', () => {
    let options = { pathFormat: 'array' };
    _.eachDeep(
      demo,
      function(value, key, parent, ctx) {
        validateIteration(value, key, parent, ctx, options);
      },
      options
    );
  });
  it('empty slots skipped', () => {
    var obj = [
      ,
      [, { a: 'b' }, , { c: 'd' }, [, 1, , 2, , 3]],
      ,
      [, , , 'a'],
      {},
    ];
    _.eachDeep(obj, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      expect(value);
    });
  });
  it('undefined are valid values, no skip', () => {
    var obj = [
      ,
      [
        ,
        { a: undefined },
        ,
        { c: undefined },
        [, undefined, , undefined, , undefined],
      ],
      ,
      [, , , undefined],
      {},
    ];
    let u = 0;
    _.eachDeep(obj, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      if (value === undefined) {
        u++;
      }
    });
    expect(u);
  });
});
