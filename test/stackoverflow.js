'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
var { demo, circular } = require('./object');

describe('stackoverflow', () => {
  //https://stackoverflow.com/questions/41610948/lodash-find-deep-in-array-of-object
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
    _.eachDeep(
      obj,
      (value, key, path, depth, parent, parentKey, parentPath) => {
        sum += (key == 'prop' && value == 'foo' && parent.val) || 0;
      }
    );
    expect(sum).equal(40);
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
    // We will need 2 passes, first - to collect needed 'id' nodes:
    var foundIds = _.filterDeep(
      obj,
      function(value, key) {
        if (key == 'id' && _.indexOf(idList, value) !== -1) return true;
      },
      // we need to disable condensing this time to keep all the paths in result object matching source,
      // otherwise array indexes may be changed and we will not find correct values in the source object later.
      { condense: false }
    );
    // second pass - to put missed 'title' nodes both for found ids and their parents.
    var filtrate = _.filterDeep(obj, function(
      value,
      key,
      path,
      depth,
      parent,
      parentKey,
      parentPath
    ) {
      if (
        _.get(foundIds, path) !== undefined ||
        (key == 'title' && _.get(foundIds, parentPath) !== undefined)
      )
        return true;
    });
    expect(filtrate).to.deep.equal([
      {
        title: 'category 1',
        children: [
          {
            title: 'subcategory 11',
            children: [{ id: 2, title: 'name 2' }, { id: 3, title: 'name 3' }],
          },
        ],
      },
      {
        title: 'category 2',
        children: [
          {
            title: 'subcategory 21',
            children: [{ id: 3, title: 'name cat2sub1id3' }],
          },
        ],
      },
    ]);
    // console.log(filtrate);
  });

  //https://stackoverflow.com/questions/48270845/deep-filtering-array-of-objects-javascript
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
    var filtrate = _.filterDeep(types, function(
      value,
      key,
      path,
      depth,
      parent
    ) {
      if (parent.checked) return true;
    });

    expect(filtrate).to.deep.equal([
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
                size: 'XS',
                checked: true,
              },
            ],
          },
        ],
      },
    ]);
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
      function(value, key, path, depth, parent) {
        if (key == 'children' && parent.id == 6 && value.length) return true;
      },
      { leafsOnly: false }
    );
    expect(children.length).to.not.equal(0);
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
    // We will need 2 passes, first - to collect needed 'name' nodes ending with 'foo':
    var foundFoo = _.filterDeep(
      obj,
      function(value, key) {
        if (key == 'name' && _.endsWith(value, endsWith)) return true;
      },
      // we need to disable condensing this time to keep all the paths in result object matching source,
      // otherwise array indexes may be changed and we will not find correct values in the source object later.
      { condense: false }
    );
    // console.log(foundFoo);
    // second pass - to add missed fields both for found 'foo' nodes and their parents.
    var filtrate = _.filterDeep(obj, function(
      value,
      key,
      path,
      depth,
      parent,
      parentKey,
      parentPath
    ) {
      if (
        _.get(foundFoo, path) !== undefined ||
        (!_.isObject(value) && _.get(foundFoo, parentPath) !== undefined)
      ) {
        // if (_.has(foundFoo, path)) console.log(`${key} has ${path}`);
        // else console.log(`${key} has parent ${parentPath}`);
        return true;
      }
    });
    expect(filtrate).to.deep.equal([
      {
        id: 1,
        name: 'topic title 1',
        sub_categories: [
          {
            id: 1,
            name: 'category title 1',
            indicators: [
              {
                id: 7,
                name: 'indicator 7 - foo',
                sub_category_id: 1,
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
        ],
      },
    ]);
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
    // We will need 2 passes, first - to collect needed nodes with 'Hit' value:
    var foundHit = _.filterDeep(
      input,
      function(value) {
        if (value.value && value.value.includes(keyword)) return true;
      },
      {
        condense: false, // keep empty slots in array to preserve correct paths
        leafsOnly: false,
      }
    );
    // second pass - to add missed fields both for found 'Hit' nodes and their parents.
    var filtrate = _.filterDeep(input, function(
      value,
      key,
      path,
      depth,
      parent,
      parentKey,
      parentPath
    ) {
      if (
        _.get(foundHit, path) !== undefined ||
        _.get(foundHit, parentPath) !== undefined
      ) {
        return true;
      }
    });
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
