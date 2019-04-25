<img src="deepdash.svg?sanitize=true" width="64px"/>

## Deepdash
Looking for eachDeep, filterDeep, omitDeep, keysDeep etc? Tree traversal extension for Lodash.

[![Known Vulnerabilities](https://snyk.io/test/npm/deepdash/badge.svg)](https://snyk.io/test/npm/deepdash) [![Travis (.org)](https://api.travis-ci.org/YuriGor/deepdash.svg?branch=master)](https://travis-ci.org/YuriGor/deepdash) [![Coverage Status](https://coveralls.io/repos/github/YuriGor/deepdash/badge.svg?branch=master)](https://coveralls.io/github/YuriGor/deepdash?branch=master) <br>
[![NPM](https://nodei.co/npm/deepdash.png?compact=true)](https://nodei.co/npm/deepdash/)

### Installation
#### In a browser
Load [script](https://cdn.jsdelivr.net/npm/deepdash/browser/deepdash.min.js) after Lodash, then pass a lodash instanced to the deepdash function:
```html
<script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/deepdash/browser/deepdash.min.js"></script>
<script>
  deepdash(_);
  console.log(_.eachDeep); // --> new methods mixed into Lodash
</script>
```

If you don't use Lodash - there is a standalone version:
```html
<script src="https://cdn.jsdelivr.net/npm/deepdash/browser/deepdash.standalone.min.js"></script>
<script>
  console.log(deepdash.eachDeep); // --> all the methods just work
</script>
```
Standalone Deepdash weigh more then "dry" version, because it includes some of cherry-picked Lodash methods it depends on.
But it's better to use Standalone version, than include full Lodash just as dependency, if you don't need Lodash.


#### Using npm:
```
npm i --save deepdash
```
In Node.js:
```js
// load Lodash if you need it
const _ = require('lodash');
//mixin all the methods into Lodash object
require('deepdash')(_);
// or cherry-pick method you only need and mix it into lodash
require('deepdash/addFilterDeep')(_);
// or cherry-pick method separately if you don't want to mutate Lodash instance
const filterDeep = require('deepdash/getFilterDeep')(_);
// If you don't need Lodash - there is standalone version
const deepdash = require('deepdash/standalone')(_); // full
const filterDeep = require('deepdash/filterDeep')(_); // or separate standalone methods
```

There is also deepdash as ES6 module
`npm i --save deepdash-es`
```js
import lodash from 'lodash-es';
import deepdash from 'deepdash-es';
const _ = deepdash(lodash);
```
in the ES package there are same cherry-pick and/or standalone methods as in the main package.
```js
import filterDeep from 'deepdash-es/filterDeep';
```
or
```js
import { filterDeep } from 'deepdash-es/standalone';
```
or
```js
import _ from 'lodash-es';
import getFilterDeep from 'deepdash-es/getFilterDeep';
const filterDeep = getFilterDeep(_);
```
or
```js
import _ from 'lodash-es';
import addFilterDeep from 'deepdash-es/addFilterDeep';
addFilterDeep(_);// --> _.filterDeep
```

## Demo
[Example react+redux app](https://kw0zox7r.codesandbox.io/) with nested comments filtered by Deepdash.([play with code here](https://codesandbox.io/s/kw0zox7r))
(not updated to v4 yet)

## Methods

### eachDeep(forEachDeep) -  iterate over all the children and sub-children (📚 [docs](https://deepdash.io/#eachdeep-foreachdeep))
<details>
  <summary>Example</summary>

[children example collection is here](#example-collection)
```js
  let children = [/* ... */];
  function displayField(val, key, parent, context) {
      if (_.isArray(parent)) {
        key = '[' + key + ']';
      }
      console.log(
        _.repeat('   ', context.depth) +
          '→ ' +
          key +
          ': ' +
          (_.isArray(val)
            ? '[' + val.length + ']'
            : _.isObject(val)
            ? '{' + (val.name || '') + '}'
            : val)
      );
    }

    console.log('\n = Iterate over tree (each child object) = \n');

    _.eachDeep(children, displayField, { childrenPath: 'children' });

    console.log('\n = Iterate over object (each field) = \n');

    _.eachDeep(children, displayField);
```

Console:

```
 = Iterate over tree (each child object) =

→ [0]: {node 1}
      → [0]: {node 1.1}
      → [1]: {node 1.2}
      → [2]: {node 1.3}
→ [1]: {node 2}
      → [0]: {node 2.1}
      → [1]: {node 2.2}
      → [2]: {node 2.3}
→ [2]: {node 3}
      → [0]: {node 3.1}
      → [1]: {node 3.2}
      → [2]: {node 3.3}

 = Iterate over object (each field) =

→ [0]: {node 1}
   → description: description for node 1
   → comment: comment for node 1
   → note: note for node 1
   → name: node 1
   → bad: false
   → children: [3]
      → [0]: {node 1.1}
         → description: description for node 1.1
         → comment: comment for node 1.1
         → note: note for node 1.1
         → name: node 1.1
         → bad: false
      → [1]: {node 1.2}
         → description: description for node 1.2
         → comment: comment for node 1.2
         → note: note for node 1.2
         → name: node 1.2
         → good: true
      → [2]: {node 1.3}
         → description: description for node 1.3
         → comment: comment for node 1.3
         → note: note for node 1.3
         → name: node 1.3
         → bad: true
         → good: false
→ [1]: {node 2}
   → description: description for node 2
   → comment: comment for node 2
   → note: note for node 2
   → name: node 2
   → good: true
   → children: [3]
      → [0]: {node 2.1}
         → description: description for node 2.1
         → comment: comment for node 2.1
         → note: note for node 2.1
         → name: node 2.1
         → bad: false
      → [1]: {node 2.2}
         → description: description for node 2.2
         → comment: comment for node 2.2
         → note: note for node 2.2
         → name: node 2.2
         → good: true
      → [2]: {node 2.3}
         → description: description for node 2.3
         → comment: comment for node 2.3
         → note: note for node 2.3
         → name: node 2.3
         → bad: true
         → good: false
→ [2]: {node 3}
   → description: description for node 3
   → comment: comment for node 3
   → note: note for node 3
   → name: node 3
   → bad: true
   → good: false
   → children: [3]
      → [0]: {node 3.1}
         → description: description for node 3.1
         → comment: comment for node 3.1
         → note: note for node 3.1
         → name: node 3.1
         → bad: false
      → [1]: {node 3.2}
         → description: description for node 3.2
         → comment: comment for node 3.2
         → note: note for node 3.2
         → name: node 3.2
         → good: true
      → [2]: {node 3.3}
         → description: description for node 3.3
         → comment: comment for node 3.3
         → note: note for node 3.3
         → name: node 3.3
         → bad: true
         → good: false
```
</details>

### filterDeep - deep filter object (📚 [docs](https://deepdash.io/#filterdeep))
<details>
  <summary>Example</summary>

[children example collection is here](#example-collection)
```js
  let children = [/* ... */];
  console.log('\n = Filter tree (good children) = \n');

  console.log(
    _.filterDeep(children, 'good', { childrenPath: 'children' })
  );

  console.log('\n = Filter object (names of good children) = \n');

  console.log(
      _.filterDeep(children, (val, key, parent) => {
        if (key == 'name' && parent.good) return true;
      })
  );
```

Console:

```
 = Filter tree (good children) =

[
  {
    "description": "description for node 1",
    "comment": "comment for node 1",
    "note": "note for node 1",
    "name": "node 1",
    "bad": false,
    "children": [
      {
        "description": "description for node 1.2",
        "comment": "comment for node 1.2",
        "note": "note for node 1.2",
        "name": "node 1.2",
        "good": true
      }
    ]
  },
  {
    "description": "description for node 2",
    "comment": "comment for node 2",
    "note": "note for node 2",
    "name": "node 2",
    "good": true,
    "children": [
      {
        "description": "description for node 2.2",
        "comment": "comment for node 2.2",
        "note": "note for node 2.2",
        "name": "node 2.2",
        "good": true
      }
    ]
  },
  {
    "description": "description for node 3",
    "comment": "comment for node 3",
    "note": "note for node 3",
    "name": "node 3",
    "bad": true,
    "good": false,
    "children": [
      {
        "description": "description for node 3.2",
        "comment": "comment for node 3.2",
        "note": "note for node 3.2",
        "name": "node 3.2",
        "good": true
      }
    ]
  }
]

 = Filter object (names of good children) =

[
  {
    "children": [
      {
        "name": "node 1.2"
      }
    ]
  },
  {
    "name": "node 2",
    "children": [
      {
        "name": "node 2.2"
      }
    ]
  },
  {
    "children": [
      {
        "name": "node 3.2"
      }
    ]
  }
]

```
</details>

### pickDeep - get object only with keys specified by names or regexes (📚 [docs](https://deepdash.io/#pickdeep))
<details>
  <summary>Example</summary>

[children example collection is here](#example-collection)
```js
  let children = [/* ... */];
  console.log('\n = Pick name and description only = \n');

  console.log(
    _.pickDeep(children, ['name', 'description'])
  );
```

Console:

```
 = Pick name and description only =

[
  {
    "description": "description for node 1",
    "name": "node 1",
    "children": [
      {
        "description": "description for node 1.1",
        "name": "node 1.1"
      },
      {
        "description": "description for node 1.2",
        "name": "node 1.2"
      },
      {
        "description": "description for node 1.3",
        "name": "node 1.3"
      }
    ]
  },
  {
    "description": "description for node 2",
    "name": "node 2",
    "children": [
      {
        "description": "description for node 2.1",
        "name": "node 2.1"
      },
      {
        "description": "description for node 2.2",
        "name": "node 2.2"
      },
      {
        "description": "description for node 2.3",
        "name": "node 2.3"
      }
    ]
  },
  {
    "description": "description for node 3",
    "name": "node 3",
    "children": [
      {
        "description": "description for node 3.1",
        "name": "node 3.1"
      },
      {
        "description": "description for node 3.2",
        "name": "node 3.2"
      },
      {
        "description": "description for node 3.3",
        "name": "node 3.3"
      }
    ]
  }
]
```
</details>


### omitDeep - get object without keys specified by names or regexes (📚 [docs](https://deepdash.io/#omitdeep))
<details>
  <summary>Example</summary>

[children example collection is here](#example-collection)
```js
  let children = [/* ... */];
  console.log('\n = Omit paths not ending with "e" = \n');

  console.log(
    _.omitDeep(children, /[^e]$/i, { onMatch: { skipChildren: false } }),
  );
```

Console:

```
 = Omit paths not ending with "e" =

[
  {
    "note": "note for node 1",
    "name": "node 1",
    "children": [
      {
        "note": "note for node 1.1",
        "name": "node 1.1"
      },
      {
        "note": "note for node 1.2",
        "name": "node 1.2"
      },
      {
        "note": "note for node 1.3",
        "name": "node 1.3"
      }
    ]
  },
  {
    "note": "note for node 2",
    "name": "node 2",
    "children": [
      {
        "note": "note for node 2.1",
        "name": "node 2.1"
      },
      {
        "note": "note for node 2.2",
        "name": "node 2.2"
      },
      {
        "note": "note for node 2.3",
        "name": "node 2.3"
      }
    ]
  },
  {
    "note": "note for node 3",
    "name": "node 3",
    "children": [
      {
        "note": "note for node 3.1",
        "name": "node 3.1"
      },
      {
        "note": "note for node 3.2",
        "name": "node 3.2"
      },
      {
        "note": "note for node 3.3",
        "name": "node 3.3"
      }
    ]
  }
]
```
</details>


### index - get an object with all the paths as keys and corresponding values (📚 [docs](https://deepdash.io/#index))
<details>
  <summary>Example</summary>

```js
  let index = _.index(
    {
      a: {
        b: {
          c: [1, 2, 3],
          'hello world': {},
        },
      },
    },
    { leavesOnly: true }
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
</details>

### paths(keysDeep) - get an array of paths (📚 [docs](https://deepdash.io/#paths-keysdeep))
<details>
  <summary>Example</summary>

```js
  let paths = _.paths(
    {
      a: {
        b: {
          c: [1, 2, 3],
          'hello world': {},
        },
      },
    },
    { leavesOnly: false }
  );
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
```
</details>

### condense - condense sparse array (📚 [docs](https://deepdash.io/#condense))
<details>
  <summary>Example</summary>

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
</details>

### condenseDeep - condense all the nested arrays (📚 [docs](https://deepdash.io/#condensedeep))
<details>
  <summary>Example</summary>

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
</details>


### exists - like a `_.has` but returns `false` for empty array slots (📚 [docs](https://deepdash.io/#exists))
<details>
  <summary>Example</summary>

```js
  var obj = [, { a: [, 'b'] }];
  console.log(_.exists(obj, 0)); // false
  console.log(_.exists(obj, 1)); // true
  console.log(_.exists(obj, '[1].a[0]')); // false
  console.log(_.exists(obj, '[1].a[1]')); // true
```
</details>

### pathToString - convert an array to string path (opposite to _.toPath) (📚 [docs](https://deepdash.io/#pathtostring))
<details>
  <summary>Example</summary>

```js
  console.log(_.pathToString(['a', 'b', 'c', 'defg', 0, '1', 2.3]));
  // a.b.c.defg[0][1]["2.3"]
  console.log(_.pathToString(['"', '"', '"']));
  // ["\\""]["\\""]["\\""]
  console.log(_.pathToString('it.s.a.string'));
  // it.s.a.string
```
</details>

#### Example Collection
<details>
  <summary>'children' object used in examples above</summary>

```js
let children = [
  {
    description: 'description for node 1',
    comment: 'comment for node 1',
    note: 'note for node 1',
    name: 'node 1',
    bad: false,
    children: [
      {
        description: 'description for node 1.1',
        comment: 'comment for node 1.1',
        note: 'note for node 1.1',
        name: 'node 1.1',
        bad: false,
      },
      {
        description: 'description for node 1.2',
        comment: 'comment for node 1.2',
        note: 'note for node 1.2',
        name: 'node 1.2',
        good: true,
      },
      {
        description: 'description for node 1.3',
        comment: 'comment for node 1.3',
        note: 'note for node 1.3',
        name: 'node 1.3',
        bad: true,
        good: false,
      },
    ],
  },
  {
    description: 'description for node 2',
    comment: 'comment for node 2',
    note: 'note for node 2',
    name: 'node 2',
    good: true,
    children: [
      {
        description: 'description for node 2.1',
        comment: 'comment for node 2.1',
        note: 'note for node 2.1',
        name: 'node 2.1',
        bad: false,
      },
      {
        description: 'description for node 2.2',
        comment: 'comment for node 2.2',
        note: 'note for node 2.2',
        name: 'node 2.2',
        good: true,
      },
      {
        description: 'description for node 2.3',
        comment: 'comment for node 2.3',
        note: 'note for node 2.3',
        name: 'node 2.3',
        bad: true,
        good: false,
      },
    ],
  },
  {
    description: 'description for node 3',
    comment: 'comment for node 3',
    note: 'note for node 3',
    name: 'node 3',
    bad: true,
    good: false,
    children: [
      {
        description: 'description for node 3.1',
        comment: 'comment for node 3.1',
        note: 'note for node 3.1',
        name: 'node 3.1',
        bad: false,
      },
      {
        description: 'description for node 3.2',
        comment: 'comment for node 3.2',
        note: 'note for node 3.2',
        name: 'node 3.2',
        good: true,
      },
      {
        description: 'description for node 3.3',
        comment: 'comment for node 3.3',
        note: 'note for node 3.3',
        name: 'node 3.3',
        bad: true,
        good: false,
      },
    ],
  },
];
```
</details>

### See [full docs](https://deepdash.io) for details.
