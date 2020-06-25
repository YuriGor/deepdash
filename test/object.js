'use strict';
const _ = require('lodash');
module.exports = () => {
  const obj = {
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
                  d: new Date(Date.parse('Mon Dec 04 1995 01:00:00 GMT')), //1995-12-04T01:00:00.000Z
                  f: function () {},
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
    objectChildren: {
      c1: {
        name: 'grand 1',
        children: {
          c1: {
            name: 'parent 1.1',
            children: {
              c1: { name: 'child 1.1.1' },
              c2: { name: 'child 1.1.2' },
            },
          },
          c2: {
            name: 'parent 1.2',
            children: {
              c1: { name: 'child 1.2.1' },
              c2: { name: 'child 1.2.2' },
            },
          },
        },
      },
      c2: {
        name: 'grand 2',
        children: {
          c1: {
            name: 'parent 2.1',
            children: {
              c1: { name: 'child 2.1.1' },
              c2: { name: 'child 2.1.2' },
            },
          },
          c2: {
            name: 'parent 2.2',
            children: {
              c1: { name: 'child 2.2.1' },
              c2: { name: 'child 2.2.2' },
            },
          },
        },
      },
    },
    objectChildrenDeeper: {
      c1: {
        name: 'grand 1',
        children: {
          values: {
            c1: {
              name: 'parent 1.1',
              children: {
                values: {
                  c1: { name: 'child 1.1.1' },
                  c2: { name: 'child 1.1.2' },
                },
              },
            },
            c2: {
              name: 'parent 1.2',
              children: {
                values: {
                  c1: { name: 'child 1.2.1' },
                  c2: { name: 'child 1.2.2' },
                },
              },
            },
          },
        },
      },
      c2: {
        name: 'grand 2',
        children: {
          values: {
            c1: {
              name: 'parent 2.1',
              children: {
                values: {
                  c1: { name: 'child 2.1.1' },
                  c2: { name: 'child 2.1.2' },
                },
              },
            },
            c2: {
              name: 'parent 2.2',
              children: {
                values: {
                  c1: { name: 'child 2.2.1' },
                  c2: { name: 'child 2.2.2' },
                },
              },
            },
          },
        },
      },
    },
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
    verifiedComments: [
      {
        name: 'Bob',
        text: 'Perfect!',
        rating: 5,
        verified: true,
        replies: [
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
    badChildren: [
      {
        name: '1',
        bad: false,
        children: [
          { name: '1.1', bad: false },
          { name: '1.2' },
          { name: '1.3', bad: true },
        ],
      },
      {
        name: '2',
        children: [
          { name: '2.1', bad: false },
          { name: '2.2' },
          { name: '2.3', bad: true },
        ],
      },
      {
        name: '3',
        bad: true,
        children: [
          { name: '3.1', bad: false },
          { name: '3.2' },
          { name: '3.3', bad: true },
        ],
      },
    ],
  };

  obj.circular = {
    a: {
      b: {
        c: {
          // e: circular.a.b,
          hi: 'planet',
        },
      },
    },
    i: [
      1,
      2,
      3,
      4,
      {
        hello: 'world',
      } /*
    ,[
      circular
      ,[circular.a]
      ,{j:{ hello: 'world' }
      ,{k:undefined}}]*/,
    ],
  };
  obj.circular.a.b.c.e = obj.circular.a.b;
  obj.circular.i.push([
    obj.circular,
    [obj.circular.a],
    { j: obj.circular.i[4] },
    { k: undefined },
  ]);

  var childrenCircular = _.cloneDeep(obj.children);
  childrenCircular[1].children[1].children[1] = childrenCircular[1];
  obj.childrenCircular = childrenCircular;

  let deeperCommentsCircular = _.cloneDeep(obj.deeperComments);
  deeperCommentsCircular[0].feedback.replies[1].feedback.replies[0] =
    deeperCommentsCircular[0];

  obj.deeperCommentsCircular = deeperCommentsCircular;

  obj.singleRoot = {
    name: 'progenitor',
    children: obj.children,
  };

  obj.social = [
    {
      _id: '5cc4bc4b015742a0d80c8b1a',
      name: 'Dalton Hull',
      friends: [
        {
          id: 0,
          name: 'Hillary Perry',
        },
        {
          id: 1,
          name: 'Cote Kim',
        },
        {
          id: 2,
          name: 'Dolly Curtis',
        },
      ],
      children: [
        {
          id: 0,
          name: 'Nicole Mcdaniel',
        },
      ],
      parents: [
        {
          id: 0,
          name: 'Francis Landry',
        },
        {
          id: 1,
          name: 'Alexandra Byrd',
        },
      ],
    },
    {
      _id: '5cc4bc4bfd19ec41acfe1a43',
      name: 'Dale Booth',
      friends: [
        {
          id: 0,
          name: 'Mcdowell Reyes',
        },
        {
          id: 1,
          name: 'Moses Mcguire',
        },
        {
          id: 2,
          name: 'Selena Phelps',
        },
      ],
      children: [
        {
          id: 0,
          name: 'Golden Vasquez',
        },
      ],
      parents: [
        {
          id: 0,
          name: 'Peck Herman',
        },
        {
          id: 1,
          name: 'Ada Crosby',
        },
      ],
    },
    {
      _id: '5cc4bc4b598e629b835fc2ff',
      name: 'Cameron Stout',
      friends: [
        {
          id: 0,
          name: 'Burgess York',
        },
        {
          id: 1,
          name: 'Martina Valentine',
        },
        {
          id: 2,
          name: 'Anita Browning',
        },
      ],
      children: [
        {
          id: 0,
          name: 'Young Marshall',
        },
        {
          id: 1,
          name: 'Bryant Bright',
        },
      ],
      parents: [
        {
          id: 0,
          name: 'Stewart Hays',
        },
        {
          id: 1,
          name: 'Saunders Craig',
        },
      ],
    },
  ];

  obj.circularArrayParent = [
    [[0], [1], [2]],
    [[0], [1], [2]],
    [[0], [1], [2]],
  ];

  obj.circularArrayParent[1][1] = obj.circularArrayParent[1];

  return obj;
};
