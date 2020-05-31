const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { validateIteration, forLodashes } = require('./common.js');

var {
  singleRoot,
  children,
  childrenCircular,
  comments,
  deeperComments,
  deeperCommentsCircular,
} = require('./object')();

forLodashes('eachDeep', (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(comments);
    let obj = _.cloneDeep(comments);
    let oOptions = { childrenPath: ['replies'] };
    let options = _.cloneDeep(oOptions);
    _.eachDeep(
      obj,
      (value, key, parentVal, ctx) => {
        validateIteration(value, key, parentVal, ctx, options);
        if (key == 'skip') return false;
      },
      options
    );
    expect(obj).to.deep.equal(orig);
    expect(options).to.deep.equal(oOptions);
  });
  it('no more regexp or boolean', () => {
    let err;
    try {
      _.eachDeep({}, () => {}, { childrenPath: /children/ });
    } catch (e) {
      err = e;
    }
    expect(err.message).to.equal('childrenPath can be string or array');
  });
  it('no mutation exclude root', () => {
    let orig = _.cloneDeep(comments);
    let obj = _.cloneDeep(comments);
    let options = { children: ['replies'], includeRoot: false };
    _.eachDeep(
      obj,
      (value, key, parentVal, ctx) => {
        validateIteration(value, key, parentVal, ctx, options);
        if (key == 'skip') return false;
      },
      options
    );
    expect(obj).to.deep.equal(orig);
  });
  it('children array - defaults', () => {
    let visited = [];
    let options = { childrenPath: 'children' };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.a.string();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.a.string();
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited).to.deep.equal([
      // undefined,
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
      '[1].children[0].children[1]',
      '[1].children[1]',
      '[1].children[1].children[0]',
      '[1].children[1].children[1]',
    ]);
  });

  it('children array - break', () => {
    let visited = [];
    let options = { childrenPath: 'children' };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.a.string();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.a.string();
        }
        visited.push(ctx.path);
        if (ctx.path == '[1].children[0].children[0]') return ctx.break();
      },
      options
    );
    expect(visited).to.deep.equal([
      // undefined,
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
    ]);
  });

  it('children array - path in error', () => {
    let visited = [];
    let options = { childrenPath: 'children' };
    try {
      _.eachDeep(
        children,
        (value, key, parent, ctx) => {
          // console.log('@' + ctx.path);
          validateIteration(value, key, parent, ctx, options);
          if (ctx.parent && ctx.parent.childrenPath !== undefined) {
            expect(ctx.parent.childrenPath).to.be.a.string();
          }
          if (ctx.parent) {
            expect(ctx.path).to.be.a.string();
          }
          visited.push(ctx.path);
          if (ctx.path == '[1].children[0].children[0]') {
            throw new Error('Enough!');
          }
        },
        options
      );
    } catch (err) {
      expect(err.message).to.equal(`Enough!
callback failed before deep iterate at:
[1].children[0].children[0]`);
    }
    expect(visited).to.deep.equal([
      // undefined,
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
    ]);

    visited = [];
    options = { childrenPath: 'children', callbackAfterIterate: true };
    try {
      _.eachDeep(
        children,
        (value, key, parent, ctx) => {
          // console.log('@' + ctx.path);
          if (!ctx.afterIterate) {
            validateIteration(value, key, parent, ctx, options);
            if (ctx.parent && ctx.parent.childrenPath !== undefined) {
              expect(ctx.parent.childrenPath).to.be.a.string();
            }
            if (ctx.parent) {
              expect(ctx.path).to.be.a.string();
            }
            visited.push(ctx.path);
          } else {
            if (ctx.path == '[1].children[0].children[0]') {
              throw new Error('Enough!');
            }
          }
        },
        options
      );
    } catch (err) {
      expect(err.message).to.equal(`Enough!
callback failed after deep iterate at:
[1].children[0].children[0]`);
    }
    expect(visited).to.deep.equal([
      // undefined,
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
    ]);
  });

  it('children array - no path in not an error', () => {
    let visited = [];
    let options = { childrenPath: 'children' };
    try {
      _.eachDeep(
        children,
        (value, key, parent, ctx) => {
          // console.log('@' + ctx.path);
          validateIteration(value, key, parent, ctx, options);
          if (ctx.parent && ctx.parent.childrenPath !== undefined) {
            expect(ctx.parent.childrenPath).to.be.a.string();
          }
          if (ctx.parent) {
            expect(ctx.path).to.be.a.string();
          }
          visited.push(ctx.path);
          if (ctx.path == '[1].children[0].children[0]') {
            throw 'Enough!';
          }
        },
        options
      );
    } catch (err) {
      expect(err).to.equal('Enough!');
    }
    expect(visited).to.deep.equal([
      // undefined,
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
    ]);

    visited = [];
    options = { childrenPath: 'children', callbackAfterIterate: true };
    try {
      _.eachDeep(
        children,
        (value, key, parent, ctx) => {
          // console.log('@' + ctx.path);
          if (!ctx.afterIterate) {
            validateIteration(value, key, parent, ctx, options);
            if (ctx.parent && ctx.parent.childrenPath !== undefined) {
              expect(ctx.parent.childrenPath).to.be.a.string();
            }
            if (ctx.parent) {
              expect(ctx.path).to.be.a.string();
            }
            visited.push(ctx.path);
          } else {
            if (ctx.path == '[1].children[0].children[0]') {
              throw 'Enough!';
            }
          }
        },
        options
      );
    } catch (err) {
      expect(err).to.equal('Enough!');
    }
    expect(visited).to.deep.equal([
      // undefined,
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
    ]);
  });

  it('children array - include root', () => {
    let visited = [];
    let options = { childrenPath: 'children', includeRoot: true };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.a.string();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.a.string();
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited).to.deep.equal([undefined]);
  });

  it('children array - include root, root is children', () => {
    let visited = [];
    let options = {
      childrenPath: 'children',
      rootIsChildren: true,
      includeRoot: true,
    };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.a.string();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.a.string();
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited).to.deep.equal([
      undefined,
      '[0]',
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
      '[1].children[0].children[1]',
      '[1].children[1]',
      '[1].children[1].children[0]',
      '[1].children[1].children[1]',
    ]);
  });

  it('children object - include root, root is children', () => {
    let visited = [];
    let options = {
      childrenPath: 'children',
      rootIsChildren: true,
      includeRoot: true,
    };
    let objChildren = {
      kid0: children[0],
      kid1: children[1],
    };
    _.eachDeep(
      objChildren,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.a.string();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.a.string();
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited).to.deep.equal([
      undefined,
      'kid0',
      'kid0.children[0]',
      'kid0.children[0].children[0]',
      'kid0.children[0].children[1]',
      'kid0.children[1]',
      'kid0.children[1].children[0]',
      'kid0.children[1].children[1]',
      'kid1',
      'kid1.children[0]',
      'kid1.children[0].children[0]',
      'kid1.children[0].children[1]',
      'kid1.children[1]',
      'kid1.children[1].children[0]',
      'kid1.children[1].children[1]',
    ]);
  });

  it('children array - exclude root, root is not children', () => {
    let visited = [];
    let options = {
      childrenPath: 'children',
      rootIsChildren: false,
      includeRoot: false,
    };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.a.string();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.a.string();
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited).to.deep.equal([]);
  });

  it('array path format', () => {
    let visited = [];
    let options = { childrenPath: 'children', pathFormat: 'array' };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.an.array();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.an.array();
        }
        visited.push(ctx.path);
      },
      options
    );

    expect(visited).to.deep.equal([
      ['0'],
      ['0', 'children', '0'],
      ['0', 'children', '0', 'children', '0'],
      ['0', 'children', '0', 'children', '1'],
      ['0', 'children', '1'],
      ['0', 'children', '1', 'children', '0'],
      ['0', 'children', '1', 'children', '1'],
      ['1'],
      ['1', 'children', '0'],
      ['1', 'children', '0', 'children', '0'],
      ['1', 'children', '0', 'children', '1'],
      ['1', 'children', '1'],
      ['1', 'children', '1', 'children', '0'],
      ['1', 'children', '1', 'children', '1'],
    ]);
  });
  it('dont include root', () => {
    let visited = [];
    let options = { childrenPath: 'children', includeRoot: false };
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath).to.be.a.string();
        }
        expect(ctx.path).to.be.a.string();
        // console.log('@' + ctx.path);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited).to.deep.equal([
      'children[0]',
      'children[0].children[0]',
      'children[0].children[0].children[0]',
      'children[0].children[0].children[1]',
      'children[0].children[1]',
      'children[0].children[1].children[0]',
      'children[0].children[1].children[1]',
      'children[1]',
      'children[1].children[0]',
      'children[1].children[0].children[0]',
      'children[1].children[0].children[1]',
      'children[1].children[1]',
      'children[1].children[1].children[0]',
      'children[1].children[1].children[1]',
    ]);
  });

  it('array path format - dont include root', () => {
    let visited = [];
    let options = {
      childrenPath: 'children',
      includeRoot: false,
      pathFormat: 'array',
    };
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent) {
          if (ctx.parent.childrenPath !== undefined) {
            expect(ctx.parent.childrenPath).to.be.a.array();
          }
          expect(ctx.path).to.be.a.array();
        }
        // console.log('@' + ctx.path);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited).to.deep.equal([
      ['children', '0'],
      ['children', '0', 'children', '0'],
      ['children', '0', 'children', '0', 'children', '0'],
      ['children', '0', 'children', '0', 'children', '1'],
      ['children', '0', 'children', '1'],
      ['children', '0', 'children', '1', 'children', '0'],
      ['children', '0', 'children', '1', 'children', '1'],
      ['children', '1'],
      ['children', '1', 'children', '0'],
      ['children', '1', 'children', '0', 'children', '0'],
      ['children', '1', 'children', '0', 'children', '1'],
      ['children', '1', 'children', '1'],
      ['children', '1', 'children', '1', 'children', '0'],
      ['children', '1', 'children', '1', 'children', '1'],
    ]);
  });

  it('checkCircular - include root', () => {
    let visited = [];
    let options = {
      childrenPath: 'children',
      includeRoot: true,
      pathFormat: 'array',
      checkCircular: true,
    };
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent) {
          if (ctx.parent.childrenPath !== undefined) {
            expect(ctx.parent.childrenPath).to.be.a.array();
          }
          expect(ctx.path).to.be.a.array();
          expect(ctx.circularParent).to.equal(null);
          expect(ctx.circularParentIndex).to.equal(-1);
        }
        visited.push(ctx.path);
      },
      options
    );

    expect(visited).to.deep.equal([
      undefined,
      ['children', '0'],
      ['children', '0', 'children', '0'],
      ['children', '0', 'children', '0', 'children', '0'],
      ['children', '0', 'children', '0', 'children', '1'],
      ['children', '0', 'children', '1'],
      ['children', '0', 'children', '1', 'children', '0'],
      ['children', '0', 'children', '1', 'children', '1'],
      ['children', '1'],
      ['children', '1', 'children', '0'],
      ['children', '1', 'children', '0', 'children', '0'],
      ['children', '1', 'children', '0', 'children', '1'],
      ['children', '1', 'children', '1'],
      ['children', '1', 'children', '1', 'children', '0'],
      ['children', '1', 'children', '1', 'children', '1'],
    ]);
  });

  it('skip root and again', () => {
    let visited = [];
    let options = {
      childrenPath: 'children',
      includeRoot: true,
      callbackAfterIterate: true,
    };
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        visited.push(ctx.path);
        if (!ctx.parent) {
          return false;
        }
        // console.log('@' + ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited).to.deep.equal([undefined, undefined]);
  });

  it('String field', () => {
    let visited = [];
    let options = { childrenPath: 'replies' };
    _.eachDeep(
      comments,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited).to.deep.equal([
      '[0]',
      '[0].replies[0]',
      '[0].replies[1]',
      '[0].replies[1].replies[0]',
      '[0].replies[1].replies[0].replies[0]',
      '[0].replies[2]',
      '[1]',
      '[1].replies[0]',
      '[1].replies[0].replies[0]',
      '[1].replies[0].replies[0].replies[0]',
      '[2]',
      '[2].replies[0]',
      '[2].replies[1]',
      '[3]',
      '[3].replies[0]',
    ]);
  });
  it('String path', () => {
    let visited = [];
    let options = {
      childrenPath: 'feedback.replies',
      includeRoot: false,
    };
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited).to.deep.equal([
      '[0]',
      '[0].feedback.replies[0]',
      '[0].feedback.replies[1]',
      '[0].feedback.replies[1].feedback.replies[0]',
      '[0].feedback.replies[1].feedback.replies[0].feedback.replies[0]',
      '[0].feedback.replies[2]',
      '[1]',
      '[1].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.replies[0]',
      '[2]',
      '[2].feedback.replies[0]',
      '[2].feedback.replies[1]',
      '[3]',
      '[3].feedback.replies[0]',
    ]);
  });
  it('String paths', () => {
    let visited = [];
    let options = {
      childrenPath: ['feedback.replies', 'feedback.reactions'],
      includeRoot: false,
    };
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited).to.deep.equal([
      '[0]',
      '[0].feedback.replies[0]',
      '[0].feedback.replies[1]',
      '[0].feedback.replies[1].feedback.replies[0]',
      '[0].feedback.replies[1].feedback.replies[0].feedback.replies[0]',
      '[0].feedback.replies[1].feedback.replies[0].feedback.reactions[0]',
      '[0].feedback.replies[2]',
      '[0].feedback.replies[2].feedback.reactions[0]',
      '[0].feedback.reactions[0]',
      '[0].feedback.reactions[1]',
      '[1]',
      '[1].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.replies[0].feedback.reactions[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.reactions[0]',
      '[2]',
      '[2].feedback.replies[0]',
      '[2].feedback.replies[1]',
      '[3]',
      '[3].feedback.replies[0]',
      '[3].feedback.reactions[0]',
    ]);
  });
  it('String paths - array path format', () => {
    let visited = [];
    let options = {
      childrenPath: ['feedback.replies', 'feedback.reactions'],
      pathFormat: 'array',
    };
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(JSON.stringify(visited, null, 2));
    expect(visited).to.deep.equal([
      ['0'],
      ['0', 'feedback', 'replies', '0'],
      ['0', 'feedback', 'replies', '1'],
      ['0', 'feedback', 'replies', '1', 'feedback', 'replies', '0'],
      [
        '0',
        'feedback',
        'replies',
        '1',
        'feedback',
        'replies',
        '0',
        'feedback',
        'replies',
        '0',
      ],
      [
        '0',
        'feedback',
        'replies',
        '1',
        'feedback',
        'replies',
        '0',
        'feedback',
        'reactions',
        '0',
      ],
      ['0', 'feedback', 'replies', '2'],
      ['0', 'feedback', 'replies', '2', 'feedback', 'reactions', '0'],
      ['0', 'feedback', 'reactions', '0'],
      ['0', 'feedback', 'reactions', '1'],
      ['1'],
      ['1', 'feedback', 'replies', '0'],
      ['1', 'feedback', 'replies', '0', 'feedback', 'replies', '0'],
      [
        '1',
        'feedback',
        'replies',
        '0',
        'feedback',
        'replies',
        '0',
        'feedback',
        'replies',
        '0',
      ],
      [
        '1',
        'feedback',
        'replies',
        '0',
        'feedback',
        'replies',
        '0',
        'feedback',
        'replies',
        '0',
        'feedback',
        'reactions',
        '0',
      ],
      [
        '1',
        'feedback',
        'replies',
        '0',
        'feedback',
        'replies',
        '0',
        'feedback',
        'reactions',
        '0',
      ],
      ['2'],
      ['2', 'feedback', 'replies', '0'],
      ['2', 'feedback', 'replies', '1'],
      ['3'],
      ['3', 'feedback', 'replies', '0'],
      ['3', 'feedback', 'reactions', '0'],
    ]);
  });

  it('circular', () => {
    let circluarPath = [];
    let options = { childrenPath: 'children', checkCircular: true };
    _.eachDeep(
      childrenCircular,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.isCircular) {
          circluarPath.push(ctx.path);

          return false;
        }
      },
      options
    );

    expect(circluarPath).to.deep.equal(['[1].children[1].children[1]']);
  });

  it('deeper circular', () => {
    let circluarPath = [];
    let options = {
      childrenPath: ['feedback.replies', 'feedback.reactions'],
      checkCircular: true,
    };
    _.eachDeep(
      deeperCommentsCircular,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.isCircular) {
          circluarPath.push(ctx.path);

          return false;
        }
      },
      options
    );

    // console.log(JSON.stringify(circluarPath));
    expect(circluarPath).to.deep.equal([
      '[0].feedback.replies[1].feedback.replies[0]',
    ]);
  });
  it('non object children', () => {
    let visited = [];
    let options = { childrenPath: 'children', rootIsChildren: true };
    _.eachDeep(
      {
        a: {
          children: ['a1', 'a2', 'a3'],
        },
        b: {
          children: 'b1,b2,b3',
        },
        c: {
          children: ['c1', 'c2', 'c3'],
        },
      },
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        visited.push(ctx.path);
      },
      options
    );
    expect(visited).to.deep.equal([
      undefined,
      'a',
      'a.children[0]',
      'a.children[1]',
      'a.children[2]',
      'b',
      'c',
      'c.children[0]',
      'c.children[1]',
      'c.children[2]',
    ]);
  });
});
