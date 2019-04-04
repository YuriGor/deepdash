'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { validateIteration } = require('./common.js');

var {
  singleRoot,
  children,
  childrenCircular,
  comments,
  deeperComments,
  deeperCommentsCircular,
} = require('./object');

describe('eachChildren', () => {
  it('no mutation', () => {
    let orig = _.cloneDeep(comments);
    let obj = _.cloneDeep(comments);
    let options = { tree: { children: ['replies'] } };
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
    let options = { tree: true };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.treeChildrenPath !== undefined) {
          expect(ctx.parent.treeChildrenPath).to.be.a.string();
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

  it('children array - include root', () => {
    let visited = [];
    let options = { tree: true, includeRoot: true };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.treeChildrenPath !== undefined) {
          expect(ctx.parent.treeChildrenPath).to.be.a.string();
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
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
      '[1].children[0].children[1]',
      '[1].children[1]',
      '[1].children[1].children[0]',
      '[1].children[1].children[1]',
    ]);
  });

  it('children array - exclude root, root is not children', () => {
    let visited = [];
    let options = { tree: { rootIsChildren: false }, includeRoot: false };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.treeChildrenPath !== undefined) {
          expect(ctx.parent.treeChildrenPath).to.be.a.string();
        }
        if (ctx.parent) {
          expect(ctx.path).to.be.a.string();
        }
        visited.push(ctx.path);
      },
      options
    );
    expect(visited).to.deep.equal([
      '[0].children[0]',
      '[0].children[0].children[0]',
      '[0].children[0].children[1]',
      '[0].children[1]',
      '[0].children[1].children[0]',
      '[0].children[1].children[1]',
      '[1].children[0]',
      '[1].children[0].children[0]',
      '[1].children[0].children[1]',
      '[1].children[1]',
      '[1].children[1].children[0]',
      '[1].children[1].children[1]',
    ]);
  });

  it('array path format', () => {
    let visited = [];
    let options = { tree: true, pathFormat: 'array' };
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent && ctx.parent.treeChildrenPath !== undefined) {
          expect(ctx.parent.treeChildrenPath).to.be.an.array();
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
    let options = { tree: true, includeRoot: false };
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent.treeChildrenPath !== undefined) {
          expect(ctx.parent.treeChildrenPath).to.be.a.string();
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
    let options = { tree: true, includeRoot: false, pathFormat: 'array' };
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, options);
        if (ctx.parent) {
          if (ctx.parent.treeChildrenPath !== undefined) {
            expect(ctx.parent.treeChildrenPath).to.be.a.array();
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
      tree: true,
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
          if (ctx.parent.treeChildrenPath !== undefined) {
            expect(ctx.parent.treeChildrenPath).to.be.a.array();
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
    let options = { tree: true, includeRoot: true, callbackAfterIterate: true };
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
    let options = { tree: { children: 'replies', rootIsChildren: true } };
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
      tree: { children: 'feedback.replies' },
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
      tree: { children: ['feedback.replies', 'feedback.reactions'] },
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
      '[0].feedback.reactions[0]',
      '[0].feedback.reactions[1]',
      '[0].feedback.replies[0]',
      '[0].feedback.replies[1]',
      '[0].feedback.replies[1].feedback.replies[0]',
      '[0].feedback.replies[1].feedback.replies[0].feedback.reactions[0]',
      '[0].feedback.replies[1].feedback.replies[0].feedback.replies[0]',
      '[0].feedback.replies[2]',
      '[0].feedback.replies[2].feedback.reactions[0]',
      '[1]',
      '[1].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.reactions[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.replies[0].feedback.reactions[0]',
      '[2]',
      '[2].feedback.replies[0]',
      '[2].feedback.replies[1]',
      '[3]',
      '[3].feedback.reactions[0]',
      '[3].feedback.replies[0]',
    ]);
  });
  it('String paths - array path format', () => {
    let visited = [];
    let options = {
      tree: { children: ['feedback.replies', 'feedback.reactions'] },
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
    // console.log(visited);
    expect(visited).to.deep.equal([
      ['0'],
      ['0', 'feedback', 'reactions', '0'],
      ['0', 'feedback', 'reactions', '1'],
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
        'reactions',
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
        'replies',
        '0',
      ],
      ['0', 'feedback', 'replies', '2'],
      ['0', 'feedback', 'replies', '2', 'feedback', 'reactions', '0'],
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
      ['2'],
      ['2', 'feedback', 'replies', '0'],
      ['2', 'feedback', 'replies', '1'],
      ['3'],
      ['3', 'feedback', 'reactions', '0'],
      ['3', 'feedback', 'replies', '0'],
    ]);
  });
  it('Regex paths', () => {
    let visited = [];
    let options = { tree: { children: /feedback\.(replies|reactions)$/ } };
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
      '[0].feedback.reactions[0]',
      '[0].feedback.reactions[1]',
      '[0].feedback.replies[0]',
      '[0].feedback.replies[1]',
      '[0].feedback.replies[1].feedback.replies[0]',
      '[0].feedback.replies[1].feedback.replies[0].feedback.reactions[0]',
      '[0].feedback.replies[1].feedback.replies[0].feedback.replies[0]',
      '[0].feedback.replies[2]',
      '[0].feedback.replies[2].feedback.reactions[0]',
      '[1]',
      '[1].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.reactions[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.replies[0]',
      '[1].feedback.replies[0].feedback.replies[0].feedback.replies[0].feedback.reactions[0]',
      '[2]',
      '[2].feedback.replies[0]',
      '[2].feedback.replies[1]',
      '[3]',
      '[3].feedback.reactions[0]',
      '[3].feedback.replies[0]',
    ]);
  });

  it('Regex paths - array path format', () => {
    let visited = [];
    let options = {
      tree: { children: /feedback\.(replies|reactions)$/ },
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
    expect(visited).to.deep.equal([
      ['0'],
      ['0', 'feedback', 'reactions', '0'],
      ['0', 'feedback', 'reactions', '1'],
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
        'reactions',
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
        'replies',
        '0',
      ],
      ['0', 'feedback', 'replies', '2'],
      ['0', 'feedback', 'replies', '2', 'feedback', 'reactions', '0'],
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
      ['2'],
      ['2', 'feedback', 'replies', '0'],
      ['2', 'feedback', 'replies', '1'],
      ['3'],
      ['3', 'feedback', 'reactions', '0'],
      ['3', 'feedback', 'replies', '0'],
    ]);
  });

  it('circular', () => {
    let circluarPath = [];
    let options = { tree: true, checkCircular: true };
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
      tree: { children: /feedback\.(replies|reactions)$/ },
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
});
