'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect,
  // assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var {
  children,
  childrenCircular,
  comments,
  verifiedComments,
  deeperComments,
  deeperCommentsCircular,
  badChildren,
} = require('./object');
var { validateIteration } = require('./common.js');

describe('filterDeep tree', () => {
  it('no mutation', () => {
    let orig = _.cloneDeep(comments);
    let obj = _.cloneDeep(comments);
    _.filterDeep(obj, 'verified', {
      tree: { children: 'replies' },
    });
    expect(obj).to.deep.equal(orig);
  });
  it('filter by field', () => {
    let filtrate = _(comments)
      .filterDeep('verified', {
        tree: { children: 'replies' },
      })
      .value();
    //console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).deep.equal(verifiedComments);
  });
  it('filter by field - pathFormat: array', () => {
    let filtrate = _(comments)
      .filterDeep('verified', {
        tree: { children: 'replies' },
        pathFormat: 'array',
      })
      .value();
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).deep.equal(verifiedComments);
  });
  it('no leavesOnly', () => {
    try {
      let filtrate = _(comments)
        .filterDeep('verified', {
          tree: { children: 'replies' },
          leavesOnly: true,
        })
        .value();
    } catch (exc) {
      expect(exc.message).equal(
        '"leavesOnly" option cannot be true in the "tree" mode.'
      );
    }
  });
  it('default', () => {
    let filtrate = _.filterDeep(children, ['name', 'child 1.2.1'], {
      tree: true,
    });
    expect(filtrate).to.deep.equal([
      {
        name: 'grand 1',
        children: [
          {
            name: 'parent 1.2',
            children: [{ name: 'child 1.2.1' }],
          },
        ],
      },
    ]);
  });
  it('filter deeper nodes circular', () => {
    let filtrate = _.filterDeep(deeperCommentsCircular, 'verified', {
      checkCircular: true,
      keepCircular: false,
      tree: { children: 'feedback.replies' },
    });
    expect(filtrate).to.deep.equal([
      {
        name: 'Bob',
        text: 'Perfect!',
        rating: 5,
        verified: true,
        feedback: {
          reactions: [
            {
              icon: '+1',
              value: 1,
              name: 'Alice',
            },
            {
              icon: '+1',
              value: 1,
              name: 'Bill',
            },
          ],
          replies: [
            {
              name: 'admin',
              text: 'Thank you!',
              verified: true,
              feedback: {
                replies: [],
              },
            },
            {
              name: 'Augusta',
              text: 'like a brillaint!11',
              verified: true,
              feedback: {
                reactions: [
                  {
                    icon: 'heart',
                    value: 0,
                    name: 'admin',
                  },
                ],
              },
            },
          ],
        },
      },
      {
        name: 'mr.John',
        text: 'Well done..',
        rating: 4,
        verified: false,
        feedback: {
          replies: [
            {
              name: 'admin',
              text: 'Can it be better?',
              verified: true,
              feedback: {
                replies: [
                  {
                    name: 'mr.John',
                    text: 'May be last three lines can be shorter..',
                    verified: false,
                    feedback: {
                      reactions: [
                        {
                          icon: 'thumb-down',
                          value: -1,
                          name: 'Bob',
                        },
                      ],
                      replies: [
                        {
                          name: 'Bob',
                          verified: true,
                          text: "Don't listen to him, it will be unreadable!",
                          feedback: {
                            reactions: [
                              {
                                icon: 'sceptic',
                                value: 0,
                                name: 'mr.John',
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        name: 'Mark',
        rating: 5,
        text: 'Any way to donate?',
        verified: false,
        feedback: {
          replies: [
            {
              name: 'Larry',
              text: '+1',
              verified: true,
            },
          ],
        },
      },
      {
        name: 'Regina',
        rating: 2,
        text: 'Not really like it',
        verified: true,
        feedback: {
          reactions: [
            {
              icon: '-1',
              value: -1,
              name: 'Bob',
            },
          ],
          replies: [
            {
              name: 'admin',
              text: ':(',
              verified: true,
            },
          ],
        },
      },
    ]);
  });
  it("Don't keep circular", () => {
    let filtrate = _.filterDeep(childrenCircular, () => true, {
      checkCircular: true,
      keepCircular: false,
      tree: true,
    });
    let err;
    try {
      JSON.stringify(filtrate);
    } catch (exc) {
      err = exc;
    }
    expect(err).equal(undefined);
  });
  it("Don't keep circular deeper", () => {
    let filtrate = _.filterDeep(deeperCommentsCircular, () => true, {
      checkCircular: true,
      keepCircular: false,
      tree: { children: 'feedback.replies' },
    });
    let err;
    try {
      JSON.stringify(filtrate);
    } catch (exc) {
      err = exc;
    }
    expect(err).equal(undefined);
  });
  it('Skip children of undefined', () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      tree: true,
      onUndefined: { skipChildren: true },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).to.deep.equal([
      {
        name: '1',
        bad: false,
        children: [
          {
            name: '1.3',
            bad: true,
          },
        ],
      },
      {
        name: '3',
        bad: true,
        children: [
          {
            name: '3.3',
            bad: true,
          },
        ],
      },
    ]);
  });
  it('Skip children of false', () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      tree: true,
      onFalse: { skipChildren: true },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).to.deep.equal([
      {
        name: '2',
        children: [
          {
            name: '2.3',
            bad: true,
          },
        ],
      },
      {
        name: '3',
        bad: true,
        children: [
          {
            name: '3.3',
            bad: true,
          },
        ],
      },
    ]);
  });
  it("Don't clone true", () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      tree: true,
      onTrue: { cloneDeep: false },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).to.deep.equal([
      {
        name: '1',
        bad: false,
        children: [{}],
      },
      {
        name: '2',
        children: [{}],
      },
      {
        children: [{}],
      },
    ]);
  });
  it("Don't clone undefined", () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      tree: true,
      onUndefined: { cloneDeep: false },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).to.deep.equal([
      {
        name: '1',
        bad: false,
        children: [
          {
            name: '1.3',
            bad: true,
          },
        ],
      },
      {
        children: [
          {
            name: '2.3',
            bad: true,
          },
        ],
      },
      {
        name: '3',
        bad: true,
        children: [
          {
            name: '3.3',
            bad: true,
          },
        ],
      },
    ]);
  });
  it("Don't clone false", () => {
    let filtrate = _.filterDeep(badChildren, 'bad', {
      tree: true,
      onFalse: { cloneDeep: false },
    });
    // console.log(JSON.stringify(filtrate, null, 2));
    expect(filtrate).to.deep.equal([
      {
        children: [
          {
            name: '1.3',
            bad: true,
          },
        ],
      },
      {
        name: '2',
        children: [
          {
            name: '2.3',
            bad: true,
          },
        ],
      },
      {
        name: '3',
        bad: true,
        children: [
          {
            name: '3.3',
            bad: true,
          },
        ],
      },
    ]);
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
      tree: true,
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
    expect(filtrate).to.deep.equal([
      {
        value: 'Miss1',
        children: [{ value: 'Hit1', children: [{ value: 'Miss3' }] }],
      },
      {
        value: 'Miss4',
        children: [{ value: 'Miss6', children: [{ value: 'Hit2' }] }],
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
        children: [{ value: 'Hit4' }],
      },
    ]);
  });
});
