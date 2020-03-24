var { validateIteration, forLodashes, it, expect } = require('./common.js');

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
    expect(obj);
    expect(options);
  });
  it('no more regexp or boolean', () => {
    let err;
    try {
      _.eachDeep({}, () => {}, { childrenPath: /children/ });
    } catch (e) {
      err = e;
    }
    expect(err.message);
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
    expect(obj);
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
          expect(ctx.parent.childrenPath);
        }
        if (ctx.parent) {
          expect(ctx.path);
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited);
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
          expect(ctx.parent.childrenPath);
        }
        if (ctx.parent) {
          expect(ctx.path);
        }
        visited.push(ctx.path);
        if (ctx.path == '[1].children[0].children[0]') return ctx.break();
      },
      options
    );
    expect(visited);
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
            expect(ctx.parent.childrenPath);
          }
          if (ctx.parent) {
            expect(ctx.path);
          }
          visited.push(ctx.path);
          if (ctx.path == '[1].children[0].children[0]') {
            throw new Error('Enough!');
          }
        },
        options
      );
    } catch (err) {
      expect(err.message);
    }
    expect(visited);

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
              expect(ctx.parent.childrenPath);
            }
            if (ctx.parent) {
              expect(ctx.path);
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
      expect(err.message);
    }
    expect(visited);
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
            expect(ctx.parent.childrenPath);
          }
          if (ctx.parent) {
            expect(ctx.path);
          }
          visited.push(ctx.path);
          if (ctx.path == '[1].children[0].children[0]') {
            throw 'Enough!';
          }
        },
        options
      );
    } catch (err) {
      expect(err);
    }
    expect(visited);

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
              expect(ctx.parent.childrenPath);
            }
            if (ctx.parent) {
              expect(ctx.path);
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
      expect(err);
    }
    expect(visited);
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
          expect(ctx.parent.childrenPath);
        }
        if (ctx.parent) {
          expect(ctx.path);
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited);
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
          expect(ctx.parent.childrenPath);
        }
        if (ctx.parent) {
          expect(ctx.path);
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited);
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
          expect(ctx.parent.childrenPath);
        }
        if (ctx.parent) {
          expect(ctx.path);
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited);
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
          expect(ctx.parent.childrenPath);
        }
        if (ctx.parent) {
          expect(ctx.path);
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited);
  });

  it('array path format', () => {
    let visited = [];
    let options = { childrenPath: 'children', pathFormat: 'array' };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath);
        }
        if (ctx.parent) {
          expect(ctx.path);
        }
        visited.push(ctx.path);
      },
      options
    );

    expect(visited);
  });
  it('dont include root', () => {
    let visited = [];
    let options = { childrenPath: 'children', includeRoot: false };
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent.childrenPath !== undefined) {
          expect(ctx.parent.childrenPath);
        }
        expect(ctx.path);
        // console.log('@' + ctx.path);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited);
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
            expect(ctx.parent.childrenPath);
          }
          expect(ctx.path);
        }
        // console.log('@' + ctx.path);
        visited.push(ctx.path);
      },
      options
    );
    // console.log(visited);
    expect(visited);
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
            expect(ctx.parent.childrenPath);
          }
          expect(ctx.path);
          expect(ctx.circularParent);
          expect(ctx.circularParentIndex);
        }
        visited.push(ctx.path);
      },
      options
    );

    expect(visited);
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
    expect(visited);
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
    expect(visited);
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
    expect(visited);
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
    expect(visited);
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
    expect(visited);
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

    expect(circluarPath);
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
    expect(circluarPath);
  });
});
