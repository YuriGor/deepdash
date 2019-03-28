'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
const asserttype = require('chai-asserttype');
chai.use(asserttype);
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
    _.eachDeep(
      obj,
      (value, key) => {
        if (key == 'skip') return false;
      },
      { tree: { children: ['replies'] } }
    );
    expect(obj).to.deep.equal(orig);
  });
  it('no mutation include root', () => {
    let orig = _.cloneDeep(comments);
    let obj = _.cloneDeep(comments);
    _.eachDeep(
      obj,
      (value, key) => {
        if (key == 'skip') return false;
      },
      { children: ['replies'], includeRoot: true }
    );
    expect(obj).to.deep.equal(orig);
  });
  it('defaults', () => {
    let total = 0;
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        // console.log(ctx.path);
        expect(ctx.parent.treeChildrenPath).to.be.a.string();
        expect(ctx.path).to.be.a.string();
        total++;
      },
      { tree: true }
    );
    expect(total).equal(14);
  });
  it('array path format', () => {
    let total = 0;
    _.eachDeep(
      children,
      (value, key, parent, ctx) => {
        expect(ctx.parent.treeChildrenPath).to.be.an.array();
        expect(ctx.path).to.be.an.array();
        total++;
      },
      { tree: true, pathFormat: 'array' }
    );
    expect(total).equal(14);
  });
  it('include root', () => {
    let total = 0;
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        if (ctx.parent) {
          expect(ctx.parent.treeChildrenPath).to.be.a.string();
          expect(ctx.path).to.be.a.string();
        }
        // console.log('@' + ctx.path);
        total++;
      },
      { tree: true, includeRoot: true }
    );
    expect(total).equal(15);
  });

  it('array path format - include root', () => {
    let total = 0;
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        if (ctx.parent) {
          expect(ctx.parent.treeChildrenPath).to.be.a.array();
          expect(ctx.path).to.be.a.array();
        }
        // console.log('@' + ctx.path);
        total++;
      },
      { tree: true, includeRoot: true, pathFormat: 'array' }
    );
    expect(total).equal(15);
  });

  it('checkCircular - include root', () => {
    let total = 0;
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        // console.log('@' + ctx.path);
        if (ctx.parent) {
          expect(ctx.parent.treeChildrenPath).to.be.a.array();
          expect(ctx.path).to.be.a.array();
          expect(ctx.circularParent).to.equal(null);
          expect(ctx.circularParentIndex).to.equal(-1);
        }
        total++;
      },
      {
        tree: true,
        includeRoot: true,
        pathFormat: 'array',
        checkCircular: true,
      }
    );
    expect(total).equal(15);
  });

  it('skip root', () => {
    let total = 0;
    _.eachDeep(
      singleRoot,
      (value, key, parent, ctx) => {
        total++;
        if (!ctx.parent) {
          return false;
        }
        // console.log('@' + ctx.path);
      },
      { tree: true, includeRoot: true, callbackAfterIterate: true }
    );
    expect(total).equal(2);
  });

  it('String field', () => {
    let total = 0;
    _.eachDeep(
      comments,
      () => {
        total++;
      },
      { tree: { children: 'replies' } }
    );
    expect(total).equal(15);
  });
  it('String path', () => {
    let total = 0;
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        //console.log('comment: ' + ctx.path);
        total++;
      },
      { tree: { children: 'feedback.replies' } }
    );
    expect(total).equal(15);
  });
  it('String paths', () => {
    let total = 0;
    let root = 0;
    let replies = 0;
    let reactions = 0;
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        // console.log(ctx.path + ' ' + value.name + ': ' + (value.text || value.icon));
        total++;
        if (ctx.parent.treeChildrenPath == 'feedback.replies') {
          replies++;
        } else if (ctx.parent.treeChildrenPath == 'feedback.reactions') {
          reactions++;
        } else {
          root++;
        }
      },
      { tree: { children: ['feedback.replies', 'feedback.reactions'] } }
    );
    // console.log(_.paths(deeperComments, { leavesOnly: false }));
    expect(root).equal(4);
    expect(replies).equal(11);
    expect(reactions).equal(7);
    expect(total).equal(15 + 7);
  });
  it('String paths - array path format', () => {
    let total = 0;
    let root = 0;
    let replies = 0;
    let reactions = 0;
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        // console.log(ctx.path + ' ' + value.name + ': ' + (value.text || value.icon));
        total++;
        if (_.isEqual(ctx.parent.treeChildrenPath, ['feedback', 'replies'])) {
          replies++;
        } else if (
          _.isEqual(ctx.parent.treeChildrenPath, ['feedback', 'reactions'])
        ) {
          reactions++;
        } else {
          root++;
        }
      },
      {
        tree: { children: ['feedback.replies', 'feedback.reactions'] },
        pathFormat: 'array',
      }
    );
    // console.log(_.paths(deeperComments, { leavesOnly: false }));
    expect(root).equal(4);
    expect(replies).equal(11);
    expect(reactions).equal(7);
    expect(total).equal(15 + 7);
  });
  it('Regex paths', () => {
    let total = 0;
    let root = 0;
    let replies = 0;
    let reactions = 0;
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        // console.log(ctx.path + ' ' + value.name + ': ' + (value.text || value.icon));
        total++;
        if (ctx.parent.treeChildrenPath === '') {
          root++;
        } else if (value.text) {
          replies++;
        } else if (value.icon) {
          reactions++;
        }
      },
      { tree: { children: /feedback\.(replies|reactions)$/ } }
    );
    // console.log(_.paths(deeperComments, { leavesOnly: false }));
    expect(total).equal(15 + 7);
    expect(root).equal(4);
    expect(replies).equal(11);
    expect(reactions).equal(7);
  });
  it('Regex paths - array path format', () => {
    let total = 0;
    let root = 0;
    let replies = 0;
    let reactions = 0;
    _.eachDeep(
      deeperComments,
      (value, key, parent, ctx) => {
        // console.log(ctx.path + ' ' + value.name + ': ' + (value.text || value.icon));
        total++;
        if (_.isEqual(ctx.parent.treeChildrenPath, [])) {
          root++;
        } else if (value.text) {
          replies++;
        } else if (value.icon) {
          reactions++;
        }
      },
      {
        tree: { children: /feedback\.(replies|reactions)$/ },
        pathFormat: 'array',
      }
    );
    // console.log(_.paths(deeperComments, { leavesOnly: false }));
    expect(total).equal(15 + 7);
    expect(root).equal(4);
    expect(replies).equal(11);
    expect(reactions).equal(7);
  });

  it('circular', () => {
    let circluarPath = [];
    _.eachDeep(
      childrenCircular,
      (value, key, parent, ctx) => {
        if (ctx.isCircular) {
          circluarPath.push(ctx.path);

          return false;
        }
      },
      { tree: true, checkCircular: true }
    );

    expect(circluarPath)
      .to.include('[1].children[1].children[1]')
      .and.to.have.property('length')
      .and.equal(1);
  });

  it('deeper circular', () => {
    let circluarPath = [];
    _.eachDeep(
      deeperCommentsCircular,
      (value, key, parent, ctx) => {
        // console.log(ctx.path);
        if (ctx.isCircular) {
          circluarPath.push(ctx.path);

          return false;
        }
      },
      {
        tree: { children: /feedback\.(replies|reactions)$/ },
        checkCircular: true,
      }
    );

    // console.log(JSON.stringify(circluarPath));
    expect(circluarPath)
      .to.include('[0].feedback.replies[1].feedback.replies[0]')
      .and.to.have.property('length')
      .and.equal(1);
  });

  //   it('circular with array path format', () => {
  //     let circluarPath = [];
  //     _.eachDeep(
  //       circular,
  //       (value, key, parent, ctx) => {
  //         ctx.parents.forEach((p) => {
  //           expect(p.path).to.be.an.array();
  //         });
  //         if (_.findIndex(ctx.parents, ['value', value]) != -1) {
  //           circluarPath.push(_.pathToString(ctx.path));
  //
  //           return false;
  //         }
  //       },
  //       { pathFormat: 'array' }
  //     );
  //
  //     expect(circluarPath)
  //       .to.include('a.b.c.e')
  //       .and.to.include('i[5][0]')
  //       .and.to.include('i[5][1][0].b.c.e')
  //       .and.to.have.property('length')
  //       .and.equal(3);
  //   });
});
