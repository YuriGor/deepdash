'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { demo, circular } = require('./object')();
var { validateIteration, forLodashes } = require('./common.js');

forLodashes(['eachDeep', 'forEachDeep', 'pathToString'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.eachDeep(obj, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      if (key == 'skip') return false;
    });
    expect(obj).to.deep.equal(orig);
  });
  it('eachDeep defaults', () => {
    let keys = [];
    _.eachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return false;
    });

    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl"]'
    );
  });
  it('eachDeep break', () => {
    let keys = [];
    _.eachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return ctx.break();
    });

    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip"]'
    );
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

    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3"]'
    );
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
      expect(err.message).to.equal(`Enough!
callback failed before deep iterate at:
a.b.c.d[6].o.skip`);
    }
    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip"]'
    );

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
      expect(err.message).to.equal(`Enough!
callback failed after deep iterate at:
a.b.c.d[6].o.skip`);
    }
    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","please","dont","go","here"]'
    );
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
      expect(err).to.equal(`Enough!`);
    }
    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip"]'
    );

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
      expect(err).to.equal(`Enough!`);
    }
    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","please","dont","go","here"]'
    );
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
      expect(JSON.stringify(keys)).equal(
        '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl"]'
      );
    });
  }
  it('alias forEachDeep', () => {
    let keys = [];
    _.forEachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
    });
    expect(JSON.stringify(keys)).equal(
      '[null,"a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","please","dont","go","here","s","b","n","u","nl"]'
    );
  });
  it('returns collection', () => {
    let c = _.forEachDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
    });
    expect(c).equal(demo);
  });
  it('no callback', () => {
    let c = _.forEachDeep(demo);
    expect(c).equal(demo);
    if (!_.v) {
      c = _(demo)
        .forEachDeep()
        .value();
      expect(c).equal(demo);
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
    expect(JSON.stringify(circluarPath)).equal(
      '["a.b.c.e","i[5][0]","i[5][1][0].b.c.e"]'
    );
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
            expect(p.path).to.be.an.array();
          } else {
            expect(p.path).equal(undefined);
          }
        });
        if (ctx.isCircular) {
          circluarPath.push(_.pathToString(ctx.path));
          return false;
        }
      },
      options
    );
    expect(JSON.stringify(circluarPath)).equal(
      '["a.b.c.e","i[5][0]","i[5][1][0].b.c.e"]'
    );
  });

  it('Array', () => {
    let keys = [];
    _.eachDeep([demo, demo], (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      keys.push(key);
      if (key == 'skip') return false;
    });
    expect(JSON.stringify(keys)).equal(
      '["0","a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl","1","a","b","c","d","0","i","1","i","2","i","3","i","4","i","5","i","6","o","d","f","skip","s","b","n","u","nl"]'
    );
  });

  it('String', () => {
    let paths = [];
    _.eachDeep('Hello?', (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal([undefined]);
  });

  it('empty props', () => {
    let paths = [];
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    _.eachDeep(o, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal([undefined, 'a', 'c']);
    paths = [];
    var a = ['a', 'b', 'c'];
    delete a[1];
    _.eachDeep(a, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal(['[0]', '[2]']);
    paths = [];
    var slots = ['start', , 'middle', , 'finish'];
    _.eachDeep(slots, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx);
      paths.push(ctx.path);
    });
    expect(paths).deep.equal(['[0]', '[2]', '[4]']);
  });
  it('generated string paths are correct', () => {
    _.eachDeep(demo, function(value, key, parent, ctx) {
      validateIteration(value, key, parent, ctx);
      if (parent) {
        assert(_.has(demo, ctx.path), 'Incorrect path: ' + ctx.path);
      }
    });
  });
  it('generated array paths are correct', () => {
    let options = { pathFormat: 'array' };
    _.eachDeep(
      demo,
      function(value, key, parent, ctx) {
        validateIteration(value, key, parent, ctx, options);
        assert(
          (ctx.path !== undefined ? _.get(demo, ctx.path) : demo) === value,
          'Incorrect path: ' + ctx.path
        );
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
      expect(value).not.to.equal(undefined);
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
    expect(u).to.equal(6);
  });
  it('afterIterate', () => {
    const data = { a: { b: { c: { d: [[[[]]]] } } } };
    const paths = [];
    _.eachDeep(
      data,
      (v, k, p, c) => {
        paths.push(`${!!c.afterIterate}: ${c.path}`);
      },
      {
        callbackAfterIterate: true,
      }
    );
    expect(paths).to.deep.equal([
      'false: undefined',
      'false: a',
      'false: a.b',
      'false: a.b.c',
      'false: a.b.c.d',
      'false: a.b.c.d[0]',
      'false: a.b.c.d[0][0]',
      'false: a.b.c.d[0][0][0]',
      'true: a.b.c.d[0][0][0]',
      'true: a.b.c.d[0][0]',
      'true: a.b.c.d[0]',
      'true: a.b.c.d',
      'true: a.b.c',
      'true: a.b',
      'true: a',
      'true: undefined',
    ]);
  });
  it('afterIterate 2d-array', () => {
    const data = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
    ];
    const paths = [];
    _.eachDeep(
      data,
      (v, k, p, c) => {
        paths.push(`${!!c.afterIterate}: ${c.path}`);
      },
      {
        callbackAfterIterate: true,
      }
    );

    expect(paths).to.deep.equal([
      'false: [0]',
      'false: [0][0]',
      'true: [0][0]',
      'false: [0][1]',
      'true: [0][1]',
      'false: [0][2]',
      'true: [0][2]',
      'false: [0][3]',
      'true: [0][3]',
      'false: [0][4]',
      'true: [0][4]',
      'false: [0][5]',
      'true: [0][5]',
      'false: [0][6]',
      'true: [0][6]',
      'false: [0][7]',
      'true: [0][7]',
      'false: [0][8]',
      'true: [0][8]',
      'true: [0]',
      'false: [1]',
      'false: [1][0]',
      'true: [1][0]',
      'false: [1][1]',
      'true: [1][1]',
      'false: [1][2]',
      'true: [1][2]',
      'false: [1][3]',
      'true: [1][3]',
      'false: [1][4]',
      'true: [1][4]',
      'false: [1][5]',
      'true: [1][5]',
      'false: [1][6]',
      'true: [1][6]',
      'false: [1][7]',
      'true: [1][7]',
      'false: [1][8]',
      'true: [1][8]',
      'true: [1]',
      'false: [2]',
      'false: [2][0]',
      'true: [2][0]',
      'false: [2][1]',
      'true: [2][1]',
      'false: [2][2]',
      'true: [2][2]',
      'false: [2][3]',
      'true: [2][3]',
      'false: [2][4]',
      'true: [2][4]',
      'false: [2][5]',
      'true: [2][5]',
      'false: [2][6]',
      'true: [2][6]',
      'false: [2][7]',
      'true: [2][7]',
      'false: [2][8]',
      'true: [2][8]',
      'true: [2]',
      'false: [3]',
      'false: [3][0]',
      'true: [3][0]',
      'false: [3][1]',
      'true: [3][1]',
      'false: [3][2]',
      'true: [3][2]',
      'false: [3][3]',
      'true: [3][3]',
      'false: [3][4]',
      'true: [3][4]',
      'false: [3][5]',
      'true: [3][5]',
      'false: [3][6]',
      'true: [3][6]',
      'false: [3][7]',
      'true: [3][7]',
      'false: [3][8]',
      'true: [3][8]',
      'true: [3]',
    ]);
  });
});
