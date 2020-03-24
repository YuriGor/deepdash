'use strict';

var { demo, circular } = require('./object')();

var { forLodashes, it, expect } = require('./common.js');
forLodashes(['eachDeep', 'filterDeep'], (_) => {
  // https://stackoverflow.com/questions/41610948/lodash-find-deep-in-array-of-object
  it('lodash-find-deep-in-array-of-object', () => {
    let obj = [
      {
        a: 10,
        elements: [
          {
            prop: 'foo',
            val: 10,
          },
          {
            prop: 'bar',
            val: 25,
          },
          {
            prop: 'test',
            val: 51,
          },
        ],
      },
      {
        b: 50,
        elements: [
          {
            prop: 'foo',
            val: 30,
          },
          {
            prop: 'bar',
            val: 15,
          },
          {
            prop: 'test',
            val: 60,
          },
        ],
      },
    ];
    let sum = 0;
    _.eachDeep(obj, (value, key, parent) => {
      sum += (key == 'prop' && value == 'foo' && parent.val) || 0;
    });
    expect(sum);
  });
  //https://stackoverflow.com/questions/19483706/javascript-how-to-filter-deep-json-objects
  it('javascript-how-to-filter-deep-json-objects', () => {
    var obj = [
      {
        title: 'category 1',
        children: [
          {
            title: 'subcategory 11',
            children: [
              { id: 1, title: 'name 1' },
              { id: 2, title: 'name 2' },
              { id: 3, title: 'name 3' },
            ],
          },
          { title: 'subcategory 12', children: [{ id: 1, title: 'name 4' }] },
        ],
      },
      {
        title: 'category 2',
        children: [
          {
            title: 'subcategory 21',
            children: [
              { id: 3, title: 'name cat2sub1id3' },
              { id: 5, title: 'name cat2sub1id5' },
            ],
          },
          {
            title: 'subcategory 22',
            children: [
              { id: 6, title: 'name cat2sub2id6' },
              { id: 7, title: 'name cat2sub2id7' },
            ],
          },
        ],
      },
    ];
    var idList = [2, 3];
    var found = _.filterDeep(
      obj,
      function(value) {
        return _.indexOf(idList, value.id) !== -1;
      },
      { childrenPath: 'children' }
    );

    expect(found);
    // console.log(filtrate);
  });

  // https://stackoverflow.com/questions/48270845/deep-filtering-array-of-objects-javascript
  it('deep-filtering-array-of-objects-javascript', () => {
    var types = [
      {
        name: 'Dresses',
        checked: true,
        collections: [
          {
            name: 'My Collection',
            checked: true,
            variations: [
              {
                size: 'XXS',
                checked: true,
              },
              {
                size: 'XS',
                checked: false,
              },
            ],
          },
          {
            name: 'False Collection',
            checked: false,
            variations: [
              {
                size: 'XXS',
                checked: false,
              },
              {
                size: 'XS',
                checked: false,
              },
            ],
          },
        ],
      },
      {
        name: 'Tops',
        checked: true,
        collections: [
          {
            name: 'Another Collection',
            checked: true,
            variations: [
              {
                size: 'XXS',
                checked: false,
              },
              {
                size: 'XS',
                checked: true,
              },
            ],
          },
        ],
      },
    ];
    var filtrate = _.filterDeep(types, function(value, key, parent) {
      if (parent.checked) return true;
    });

    expect(filtrate);
  });
  // https://stackoverflow.com/questions/53381935/javascript-find-deeply-nested-objects
  it('javascript-find-deeply-nested-objects', () => {
    var obj = [
      {
        label: 'first',
        id: 1,
        children: [],
      },
      {
        label: 'second',
        id: 2,
        children: [
          {
            label: 'third',
            id: 3,
            children: [
              {
                label: 'fifth',
                id: 5,
                children: [],
              },
              {
                label: 'sixth',
                id: 6,
                children: [
                  {
                    label: 'seventh',
                    id: 7,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            label: 'fourth',
            id: 4,
            children: [],
          },
        ],
      },
    ];
    var children = _.filterDeep(
      obj,
      function(value, key, parent) {
        if (key == 'children' && parent.id == 6 && value.length) return true;
      },
      { leavesOnly: false }
    );
    expect(children.length);
    // console.log(children);
  });
  // https://stackoverflow.com/questions/42167573/filtering-array-based-on-value-in-deeply-nested-object-in-javascript
  it('filtering-array-based-on-value-in-deeply-nested-object-in-javascript', function() {
    var obj = [
      {
        id: 1,
        name: 'topic title 1',
        sub_categories: [
          {
            id: 1,
            name: 'category title 1',
            indicators: [
              {
                id: 1,
                name: 'indicator 1',
                sub_category_id: 1,
              },
              {
                id: 7,
                name: 'indicator 7 - foo',
                sub_category_id: 1,
              },
            ],
          },
          {
            id: 6,
            name: 'category title 6',
            indicators: [
              {
                id: 8,
                name: 'indicator 8',
                sub_category_id: 6,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'topic title 2',
        sub_categories: [
          {
            id: 2,
            name: 'category 2',
            indicators: [
              {
                id: 2,
                name: 'indicator 2 - foo',
                sub_category_id: 2,
              },
            ],
          },
          {
            id: 4,
            name: 'category 4',
            indicators: [
              {
                id: 5,
                name: 'indicator 5',
                sub_category_id: 4,
              },
            ],
          },
        ],
      },
    ];
    var endsWith = 'foo';
    var foundFoo = _.filterDeep(
      obj,
      function(value, key) {
        return _.endsWith(value.name, endsWith);
      },
      { childrenPath: ['sub_categories', 'indicators'] }
    );

    expect(foundFoo);
  });
  // https://stackoverflow.com/questions/38132146/recursively-filter-array-of-objects
  it('recursively-filter-array-of-objects', () => {
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
    var foundHit = _.filterDeep(
      input,
      function(value) {
        return value.value.includes(keyword);
      },
      {
        childrenPath: 'children',
        onTrue: { skipChildren: true },
      }
    );

    expect(foundHit);
  });
  // https://stackoverflow.com/questions/28682244/deep-filter-of-object-properties
  it('deep-filter-of-object-properties', () => {
    var data = {
      name: {
        first: 'Sam',
        last: 'Wise',
        invalid: 'Not A Valid Property',
      },
      address: '210 Test St.',
      city: 'Springfield',
      state: 'CA',
      zip: '65565',
      invalid_key1: 'Something invalid',
      invalid_key2: 'Another invalid one',
    };
    var controlObject = {
      name: {
        first: true,
        last: true,
      },
      address: true,
      city: true,
      state: true,
      zip: true,
    };
    var filtrate = _.filterDeep(data, function(value, key, parent, ctx) {
      return _.has(controlObject, ctx.path);
    });
    expect(filtrate);
  });
  // https://stackoverflow.com/questions/53710404/compare-objects-recursively-and-put-duplicate-key-values-into-array
  it('compare-objects-recursively-and-put-duplicate-key-values-into-array', () => {
    let objects = [
      {
        first_name: 'Tom',
        height: {
          feet: 5,
          inches: 0,
        },
      },
      {
        first_name: 'Thomas',
        last_name: 'Walsh',
        email: 'tomwalsh@domain.com',
        height: {
          feet: 6,
          inches: 0,
        },
      },
      {
        email: 'tomwalsh@sample.edu',
      },
    ];
    let merged = _.cloneDeep(objects.shift()); // clone to keep source untouched
    objects.forEach((obj) => {
      _.eachDeep(obj, (value, key, parent, ctx) => {
        if (_.isObject(value)) return;
        let exists = _.get(merged, ctx.path);
        if (exists == undefined) {
          exists = value;
        } else {
          exists = _.uniq([].concat(exists, value));
          if (exists.length == 1) exists = exists[0];
        }
        _.set(merged, ctx.path, exists);
      });
    });
    expect(merged);
  });
  // https://stackoverflow.com/questions/49179891/filter-deeply-nested-data-and-return-all-parent-immediate-child-items-js
  it('filter-deeply-nested-data-and-return-all-parent-immediate-child-items-js', () => {
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
          _.includes(filterList, _.get(ctx, 'parent.value.name'));
        // console.log(' - ' + ctx.path, res);
        return res;
      },
      {
        childrenPath: ['child.items', 'items'],
      }
    );
    // remove empty 'child'
    // console.log(JSON.stringify(arr, null, 2));
    arr = _.filterDeep(
      arr,
      (val, key) => {
        return key != 'child' || (val !== null && val.items.length > 0);
      },
      { leavesOnly: false, onTrue: { skipChildren: false } }
    );
    expect(arr);
  });
});
