<img src="deepdash.svg?sanitize=true" width="64px"/>

## deepdash
Looking for eachDeep, keysDeep etc? Tree traversal extension for lodash.

[![npm](https://img.shields.io/npm/v/deepdash.svg)](https://www.npmjs.com/package/deepdash) [![Travis (.org)](https://api.travis-ci.org/YuriGor/deepdash.svg?branch=master)](https://travis-ci.org/YuriGor/deepdash) [![Coverage Status](https://coveralls.io/repos/github/YuriGor/deepdash/badge.svg?branch=master)](https://coveralls.io/github/YuriGor/deepdash?branch=master) <br>
[![NPM](https://nodei.co/npm/deepdash.png?compact=true)](https://nodei.co/npm/deepdash/)

### Installation
In a browser load [script](https://raw.githubusercontent.com/YuriGor/deepdash/master/deepdash.js) after lodash:
```html
<script src="lodash.js"></script>
<script src="deepdash.js"></script>
```
Using npm:
```
npm i --save deepdash
```
In Node.js (same for the Angular component):
```js
//mixin new methods into lodash object
const _ = require('deepdash')(require('lodash'));
```
### Usage

```js
let obj = {
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
};
_.eachDeep(obj, (value, key, path, depth, parent, parentKey, parentPath) => {
  console.log(
    _.repeat('  ', depth) +
      key +
      ':' +
      (value === null ? 'null' : typeof value),
    parentPath && ' @' + parentPath
  );
  if(key=="skip"){
    return false; // return false explicitly to skip iteration over current value's children
  }
});
```
Console:
```
a:object
  b:object  @a
    c:object  @a.b
      d:object  @a.b.c
        0:object  @a.b.c.d
          i:number  @a.b.c.d[0]
        1:object  @a.b.c.d
          i:number  @a.b.c.d[1]
        2:object  @a.b.c.d
          i:number  @a.b.c.d[2]
        3:object  @a.b.c.d
          i:number  @a.b.c.d[3]
        4:object  @a.b.c.d
          i:number  @a.b.c.d[4]
        5:object  @a.b.c.d
          i:number  @a.b.c.d[5]
        6:object  @a.b.c.d
          o:object  @a.b.c.d[6]
            d:object  @a.b.c.d[6].o
            f:function  @a.b.c.d[6].o
            skip:object  @a.b.c.d[6].o
      s:string  @a.b.c
    b:boolean  @a.b
  n:number  @a
  u:undefined  @a
nl:null
```
Chaining works too:
```js
  _(obj).eachDeep((value, key, path, depth, parent, parentKey, parentPath) => {/* do */}).value();
```

## Methods

### eachDeep (forEachDeep)

Invokes given callback for each field and element of given object or array, nested too.

```js
_.eachDeep(
  obj,                 // The object to iterate over
  iteratee=_.identity, // The function invoked per iteration
  options={
    track: false       /* track parents from current back to the root,
                          useful for circular reference detecting.
                          If true, `iteratee` will have additional `parents` object argument
                          with `values`, `keys` and `paths` arrays inside. */
  }
)
```
**Example:**
```js
  let circular = { a: { b: { c: {} } } };
  circular.a.b.c = circular;
  _.eachDeep(
    circular,
    (value, key, path, depth, parent, parentKey, parentPath, parents) => {
      if (_.indexOf(parents.values, value) !== -1) {
        console.log(
          "Circular reference skipped for '" + key + "' at " + parentPath
        );
        return false;
      }
      //do your things
    }
  ,{track:true});
```
Console:
```
  Circular reference skipped for 'c' at a.b
```

### indexate

Creates an 'index' flat object with paths as keys and corresponding values.

```js
_.indexate(
  obj,                          // The object to iterate over.
  options={
    checkCircular: false,       // Check each value to not be one of the parents, to avoid circular references.
    includeCircularPath: true,  /* If found some circular reference - include path to it into result or skip it.
                                   Option ignored if `checkCircular:false`. */
    leafsOnly: true             /* Return paths to childless values only by default.
                                   Or all the paths will be returned, including parents, if set to false. */
  }
)
```

**Example:**
```js
  let index = _.indexate(
    {
      a: {
        b: {
          c: [1, 2, 3],
          'hello world': {},
        },
      },
    },
    { leafsOnly: true }
  );
  console.log(index);
```
Console:
```
  { 'a.b.c[0]': 1,
    'a.b.c[1]': 2,
    'a.b.c[2]': 3,
    'a.b["hello world"]': {} }
```

### paths (keysDeep)

Creates an array of the paths of object or array.

```js
_.paths(
  obj,                         // The object to iterate over.
  options = {
    checkCircular: false,      // Check each value to not be one of the parents, to avoid circular references.
    includeCircularPath: true, /* If found some circular reference - include path to it into result or skip it.
                                  Option ignored if `checkCircular:false`. */
    leafsOnly: true            /* Return paths to childless values only by default.
                                  Or all the paths will be returned, including parents, if set to false. */
  }
)
```

**Example:**
```js
  let paths = _.paths({
    a: {
      b: {
        c: [1, 2, 3],
        "hello world":{}
      },
    },
  });
  console.log(paths);
  paths = _.paths({
    a: {
      b: {
        c: [1, 2, 3],
        "hello world":{}
      },
    },
  },{ leafsOnly: false });
  console.log(paths);
```
Console:
```
  [ 'a',
    'a.b',
    'a.b.c',
    'a.b.c[0]',
    'a.b.c[1]',
    'a.b.c[2]',
    'a.b["hello world"]' ]

  [
    'a.b.c[0]',
    'a.b.c[1]',
    'a.b.c[2]',
    'a.b["hello world"]' ]
```

### filterDeep

Returns and object with childs of your choice only

```js
_.filterDeep(
  obj,                             // The object to iterate over.
  predicate,                       /* The predicate is invoked with eight arguments:
                                      (value, key|index, path, depth, parent, parentKey, parentPath, parents)
                                      - If predicate returns `true` - value will be deeply cloned to result object
                                      no further iteration over children of this value will be performed.
                                      - If predicate returns `false` - value will be completely excluded from the result object
                                      no further iteration over children of this value will be performed.
                                      - If predicate returns `undefined` - current path will only appear in the result object
                                      if some child elements will pass the filter during subsequent iterations. */
  options = {
    checkCircular: false,          // Check each value to not be one of the parents, to avoid circular references.
    keepCircular: true,            // result object will contain circular references if they passed the filter.
    // replaceCircularBy: <value>, // Specify the value to replace circular references by.
    leafsOnly: true,               /* Return paths to childless values only by default.
                                      Or all the paths will be returned, including parents, if set to false. */
    condense: true,                // Condense result object, since exluding some paths may produce sparse arrays
    cloneDeep: _.cloneDeep,        // Method to use for deep cloning values, lodash cloneDeep by default.
  }
)
```
**Example:**
```js
  let things = {
    things: [
      { name: 'something', good: false },
      {
        name: 'another thing', good: true,
        children: [
          { name: 'child thing 1', good: false },
          { name: 'child thing 2', good: true },
          { name: 'child thing 3', good: false },
        ],
      },
      {
        name: 'something else', good: true,
        subItem: { name: 'sub-item', good: false },
        subItem2: { name: 'sub-item-2', good: true },
      },
    ],
  };
  let filtrate = _.filterDeep(
    things,
    (value, key, path, depth, parent, parentKey, parentPath, parents) => {
      if (key == 'name' && parent.good) return true;
      if (key == 'good' && value == true) return true;
    },
    { leafsOnly: true }
  );
  console.log(filtrate);
```
Console:
```
  { things:
   [ { name: 'another thing',
       good: true,
       children: [ { name: 'child thing 2', good: true } ] },
     { name: 'something else',
       good: true,
       subItem2: { name: 'sub-item-2', good: true } } ] }
```

### condense

Makes sparsed aray non-sparsed. This method mutates object.

```js
_.condense(
  arr // array to condense
);
```

**Example:**
```js
  let arr = ['a', 'b', 'c', 'd', 'e'];
  delete arr[1];
  console.log(arr);
  delete arr[3];
  console.log(arr);
  _.condense(arr);
  console.log(arr);
```
Console:
```
  [ 'a', <1 empty item>, 'c', 'd', 'e' ]
  [ 'a', <1 empty item>, 'c', <1 empty item>, 'e' ]
  [ 'a', 'c', 'e' ]
```

### condenseDeep

Make all the arrays in the object non-sparsed.

```js
_.condenseDeep(
  obj,                  // The object to iterate over.
  options = {
  checkCircular: false, // Check each value to not be one of the parents, to avoid circular references.
);
```
**Example:**
```js
  let obj = { arr: ['a', 'b', { c: [1, , 2, , 3] }, 'd', 'e'] };
  delete obj.arr[1];
  delete obj.arr[3];
  _.condenseDeep(obj);
  console.log(obj);
```
Console:
```
  { arr: [ 'a', { c: [ 1, 2, 3 ] }, 'e' ] }
```
### Other traversal methods
Feel free [to request](https://github.com/YuriGor/deepdash/issues/new) other methods implementation.
