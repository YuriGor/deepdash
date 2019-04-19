'use strict';
var {
  demo,
  circular,
  comments,
  children,
  verifiedComments,
} = require('./object');
const _ = require('../deepdash')(require('lodash'));
function isNS(value, key, parent, ctx) {
  let t = typeof value;
  console.log(`@${ctx.path}`, t == 'number' || t == 'string' ? value : false);
  return t == 'number' || t == 'string';
}

const data = {
  level: 'Level 1',
  items: [
    {
      name: 'Some Business Name',
      id: '123',
      data: null,
      child: {
        level: 'Level 2',
        items: [
          {
            name: 'Some Sub-Business Name',
            id: '1234',
            data: null,
            child: {
              level: 'Level 3',
              items: [
                {
                  name: 'Some Area Name',
                  id: '12345',
                  data: null,
                  child: {
                    level: 'Level 4',
                    items: [
                      {
                        name: 'Some Local Name',
                        id: '123456',
                        data: null,
                        child: {
                          level: 'Level 5',
                          items: [
                            {
                              name: 'Some Product Name',
                              id: '1234567',
                              data: [2, 35, 235, 35554, 55554],
                              child: null,
                            },
                            {
                              name: 'Some Product Name 2',
                              id: '12345678',
                              data: [9, 5, 35, 5764, 335],
                              child: null,
                            },
                          ],
                        },
                      },
                      {
                        name: 'Some Local Name 2',
                        id: '123456',
                        data: null,
                        child: {
                          level: 'Level 5',
                          items: [
                            {
                              name: 'Some Product Name 3',
                              id: '1234567',
                              data: [2, 35, 235, 35554, 55554],
                              child: null,
                            },
                            {
                              name: 'Some Product Name 4',
                              id: '12345678',
                              data: [9, 5, 35, 5764, 335],
                              child: null,
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: 'Some Area Name 2',
                  id: '12345',
                  data: null,
                  child: {
                    level: 'Level 4',
                    items: [
                      {
                        name: 'Some Local Name 3',
                        id: '123456',
                        data: null,
                        child: {
                          level: 'Level 5',
                          items: [
                            {
                              name: 'Some Product Name 5',
                              id: '1234567',
                              data: [2, 35, 235, 35554, 55554],
                              child: null,
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
      name: 'Some Business Name 2',
      id: '123',
      data: null,
      child: {
        level: 'Level 2',
        items: [
          {
            name: 'Some Sub-Business Name 2',
            id: '1234',
            data: null,
            child: {
              level: 'Level 3',
              items: [
                {
                  name: 'Some Area Name 3',
                  id: '12345',
                  data: null,
                  child: {
                    level: 'Level 4',
                    items: [
                      {
                        name: 'Some Local Name 4',
                        id: '123456',
                        data: null,
                        child: {
                          level: 'Level 5',
                          items: [
                            {
                              name: 'Some Product Name 6',
                              id: '1234567',
                              data: [2, 35, 235, 35554, 55554],
                              child: null,
                            },
                            {
                              name: 'Some Product Name 7',
                              id: '12345678',
                              data: [9, 5, 35, 5764, 335],
                              child: null,
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
            name: 'Some Sub-Business Name 3',
            id: '1234',
            data: null,
            child: {
              level: 'Level 3',
              items: [
                {
                  name: 'Some Area Name 5',
                  id: '12345',
                  data: null,
                  child: {
                    level: 'Level 4',
                    items: [
                      {
                        name: 'Some Local Name 5',
                        id: '123456',
                        data: null,
                        child: {
                          level: 'Level 5',
                          items: [
                            {
                              name: 'Some Product Name 8',
                              id: '1234567',
                              data: [2, 35, 235, 35554, 55554],
                              child: null,
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
  ],
};
const filterList = [
  'Some Business Name',
  'Some Business Name 2',
  'Some Sub-Business Name',
  'Some Sub-Business Name 2',
  'Some Area Name',
  'Some Area Name 3',
  'Some Local Name 2',
  'Some Local Name 4',
];
// filter by name
let arr = _.filterDeep(
  data,
  (item, key, parentVal, ctx) => {
    let res =
      _.includes(filterList, item.name) ||
      (ctx.parent && _.includes(filterList, _.get(ctx, 'parent.value.name')));
    // console.log(' - ' + ctx.path, res, _.get(ctx, 'parent.value.name'));
    return res;
  },
  {
    childrenPath: ['child.items', 'items'],
  }
);
//remove empty 'child'
// console.log(JSON.stringify(arr, null, 2));
arr = _.filterDeep(
  arr,
  (val, key) => {
    return key != 'child' || (val !== null && val.items.length > 0);
  },
  { leavesOnly: false, onTrue: { skipChildren: false } }
);
