'use strict';
const _ = require('lodash');

module.exports = {
  demo: {
    a: {
      b: {
        c: {
          d: [
            { i: 0 },
            { i: 1 },
            { i: 2 },
            { i: 3 },
            { i: 4 },
            { i: 5 },
            {
              o: {
                d: new Date(),
                f: function() {},
                skip: {
                  please: {
                    dont: {
                      go: {
                        here: 'skip it',
                      },
                    },
                  },
                },
              },
            },
          ],
          s: 'hello',
        },
        b: true,
      },
      n: 12345,
      u: undefined,
    },
    nl: null,
  },
  circular: {
    a: {
      b: {
        c: {
          // e: circular.a.b,
          hi: 'planet',
        },
      },
    },
    i: [1, 2, 3, 4, { hello: 'world' }],
  },
  children: [
    {
      name: 'grand 1',
      children: [
        {
          name: 'parent 1.1',
          children: [{ name: 'child 1.1.1' }, { name: 'child 1.1.2' }],
        },
        {
          name: 'parent 1.2',
          children: [{ name: 'child 1.2.1' }, { name: 'child 1.2.2' }],
        },
      ],
    },
    {
      name: 'grand 2',
      children: [
        {
          name: 'parent 2.1',
          children: [{ name: 'child 2.1.1' }, { name: 'child 2.1.2' }],
        },
        {
          name: 'parent 2.2',
          children: [{ name: 'child 2.2.1' }, { name: 'child 2.2.2' }],
        },
      ],
    },
  ],
  comments: [
    {
      name: 'Bob',
      text: 'Perfect!',
      rating: 5,
      verified: true,
      replies: [
        {
          name: 'Alice',
          text: 'Agree',
          verified: false,
        },
        {
          name: 'admin',
          text: 'Thank you!',
          verified: true,
          replies: [
            {
              name: 'Bob',
              text: 'Write more!',
              verified: true,
              replies: [
                {
                  name: 'admin',
                  text: 'Ok :)',
                  verified: true,
                },
              ],
            },
          ],
        },
        {
          name: 'Augusta',
          text: 'like a brillaint!11',
          verified: true,
        },
      ],
    },
    {
      name: 'mr.John',
      text: 'Well done..',
      rating: 4,
      verified: false,
      replies: [
        {
          name: 'admin',
          text: 'Can it be better?',
          verified: true,
          replies: [
            {
              name: 'mr.John',
              text: 'May be last three lines can be shorter..',
              verified: false,
              replies: [
                {
                  name: 'Bob',
                  verified: true,
                  text: "Don't listen to him, it will be unreadable!",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Mark',
      rating: 5,
      text: 'Any way to donate?',
      verified: false,
      replies: [
        {
          name: 'Bill',
          text: '+1',
          verified: false,
        },
        {
          name: 'Larry',
          text: '+1',
          verified: true,
        },
      ],
    },
    {
      name: 'Regina',
      rating: 2,
      text: 'Not really like it',
      verified: true,
      replies: [
        {
          name: 'admin',
          text: ':(',
          verified: true,
        },
      ],
    },
  ],
  deeperComments: [
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
            name: 'Alice',
            text: 'Agree',
            verified: false,
          },
          {
            name: 'admin',
            text: 'Thank you!',
            verified: true,
            feedback: {
              replies: [
                {
                  name: 'Bob',
                  text: 'Write more!',
                  verified: true,
                  feedback: {
                    reactions: [
                      {
                        icon: '+1',
                        value: 1,
                        name: 'Alice',
                      },
                    ],
                    replies: [
                      {
                        name: 'admin',
                        text: 'Ok :)',
                        verified: true,
                      },
                    ],
                  },
                },
              ],
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
            name: 'Bill',
            text: '+1',
            verified: false,
          },
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
  ],
};

module.exports.circular.a.b.c.e = module.exports.circular.a.b;
module.exports.circular.i.push([
  module.exports.circular,
  [module.exports.circular.a],
  { j: module.exports.circular.i[4] },
  { k: module.exports.circular.i[5] },
]);

var childrenCircular = _.cloneDeep(module.exports.children);
childrenCircular[1].children[1].children[1] = childrenCircular[1];
module.exports.childrenCircular = childrenCircular;

let deeperCommentsCircular = _.cloneDeep(module.exports.deeperComments);
deeperCommentsCircular[0].feedback.replies[1].feedback.replies[0] =
  deeperCommentsCircular[0];

module.exports.deeperCommentsCircular = deeperCommentsCircular;
