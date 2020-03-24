'use strict';

var {
  children,
  childrenCircular,
  comments,
  verifiedComments,
  deeperComments,
  deeperCommentsCircular,
  badChildren,
} = require('./object')();
var { validateIteration, forLodashes, it, expect } = require('./common.js');

forLodashes(['findDeep'], (_) => {
  it('findTree by field', () => {
    let found = _.findDeep(comments, 'verified', {
      childrenPath: 'replies',
    });
    //console.log(JSON.stringify(found, null, 2));
    expect(found.value.text);
    found = _.findDeep(comments, ['verified', false], {
      childrenPath: 'replies',
    });
    //console.log(JSON.stringify(found, null, 2));
    expect(found.value.text);
  });
  it('findTree by field - pathFormat: array', () => {
    let found = _.findDeep(comments, 'verified', {
      childrenPath: 'replies',
      pathFormat: 'array',
    });
    // console.log(JSON.stringify(found, null, 2));
    expect(found.value.text);
  });
  it('findTree no leavesOnly', () => {
    try {
      let found = _.findDeep(comments, 'verified', {
        childrenPath: 'replies',
        leavesOnly: true,
      });
    } catch (exc) {
      expect(exc.message);
    }
  });
  it('findTree default', () => {
    let found = _.findDeep(children, ['name', 'child 1.2.1'], {
      childrenPath: 'children',
    });
    expect(found.context.path);
  });

  it('findTree rootIsChildren', () => {
    let found = _.findDeep(
      { g1: children[0], g2: children[1] },
      ['name', 'child 1.2.1'],
      {
        childrenPath: 'children',
        rootIsChildren: true,
      }
    );
    expect(found.context.path);
  });

  it('findTree deeper nodes circular', () => {
    let found = _.findDeep(
      deeperCommentsCircular,
      {
        verified: true,
        text: "Don't listen to him, it will be unreadable!",
      },
      {
        checkCircular: true,
        childrenPath: 'feedback.replies',
      }
    );
    expect(found.value.name);
    expect(found.context.path);
  });
});
