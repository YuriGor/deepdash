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

forLodashes(['filterDeep'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(comments);
    let obj = _.cloneDeep(comments);
    _.filterDeep(obj, 'verified', {
      childrenPath: 'replies',
    });
    expect(obj);
  });
  it('filter by field', () => {
    let filtrate = _.filterDeep(comments, 'verified', {
      childrenPath: 'replies',
    });
    //console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
  it('filter by field - pathFormat: array', () => {
    let filtrate = _.filterDeep(comments, 'verified', {
      childrenPath: 'replies',
      pathFormat: 'array',
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
  it('no leavesOnly', () => {
    try {
      let filtrate = _.filterDeep(comments, 'verified', {
        childrenPath: 'replies',
        leavesOnly: true,
      });
    } catch (exc) {
      expect(exc.message);
    }
  });
  it('default', () => {
    let filtrate = _.filterDeep(children, ['name', 'child 1.2.1'], {
      childrenPath: 'children',
    });
    expect(filtrate);
  });

  it('rootIsChildren', () => {
    let filtrate = _.filterDeep(
      { g1: children[0], g2: children[1] },
      ['name', 'child 1.2.1'],
      {
        childrenPath: 'children',
        rootIsChildren: true,
      }
    );
    expect(filtrate);
  });

  it('filter deeper nodes circular', () => {
    let filtrate = _.filterDeep(deeperCommentsCircular, 'verified', {
      checkCircular: true,
      keepCircular: false,
      childrenPath: 'feedback.replies',
    });
    expect(filtrate);
  });
  it("Don't keep circular", () => {
    let filtrate = _.filterDeep(childrenCircular, () => true, {
      checkCircular: true,
      keepCircular: false,
      childrenPath: 'children',
    });
    let err;
    try {
      JSON.stringify(filtrate);
    } catch (exc) {
      err = exc;
    }
    expect(err);
  });
  it("Don't keep circular deeper", () => {
    let filtrate = _.filterDeep(deeperCommentsCircular, () => true, {
      checkCircular: true,
      keepCircular: false,
      childrenPath: 'feedback.replies',
    });
    let err;
    try {
      JSON.stringify(filtrate);
    } catch (exc) {
      err = exc;
    }
    expect(err);
  });
  it('Skip children of undefined', () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      childrenPath: 'children',
      onUndefined: { skipChildren: true },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
  it('Skip children of false', () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      childrenPath: 'children',
      onFalse: { skipChildren: true },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
  it("Don't clone true", () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      childrenPath: 'children',
      onTrue: { cloneDeep: false },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
  it("Don't clone undefined", () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      childrenPath: 'children',
      onUndefined: { cloneDeep: false },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
  it("Don't clone false", () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      childrenPath: 'children',
      onFalse: { cloneDeep: false },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
  it('array path format', () => {
    const input = [
      {
        value: 'Miss1',
        children: [
          { value: 'Miss2' },
          { value: 'Hit1', children: [{ value: 'Miss3' }] },
        ],
      },
      {
        value: 'Miss4',
        children: [
          { value: 'Miss5' },
          { value: 'Miss6', children: [{ value: 'Hit2' }] },
        ],
      },
      {
        value: 'Miss7',
        children: [
          { value: 'Miss8' },
          { value: 'Miss9', children: [{ value: 'Miss10' }] },
        ],
      },
      {
        value: 'Hit3',
        children: [
          { value: 'Miss11' },
          { value: 'Miss12', children: [{ value: 'Miss13' }] },
        ],
      },
      {
        value: 'Miss14',
        children: [
          { value: 'Hit4' },
          { value: 'Miss15', children: [{ value: 'Miss16' }] },
        ],
      },
    ];
    var keyword = 'Hit';
    let options = {
      pathFormat: 'array',
      childrenPath: 'children',
      onTrue: { skipChildren: true },
    };
    var filtrate = _.filterDeep(
      input,
      function(value, key, parent, ctx) {
        validateIteration(value, key, parent, ctx, options);
        if (value.value && value.value.includes(keyword)) return true;
      },
      options
    );
    //console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate);
  });
});
