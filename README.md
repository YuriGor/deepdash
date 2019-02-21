<img src="deepdash.svg?sanitize=true" width="64px"/>

## Deepdash
Looking for eachDeep, filterDeep, omitDeep, keysDeep etc? Tree traversal extension for Lodash.

[![Known Vulnerabilities](https://snyk.io/test/npm/deepdash/badge.svg)](https://snyk.io/test/npm/deepdash) [![Travis (.org)](https://api.travis-ci.org/YuriGor/deepdash.svg?branch=master)](https://travis-ci.org/YuriGor/deepdash) [![Coverage Status](https://coveralls.io/repos/github/YuriGor/deepdash/badge.svg?branch=master)](https://coveralls.io/github/YuriGor/deepdash?branch=master) <br>
[![NPM](https://nodei.co/npm/deepdash.png?compact=true)](https://nodei.co/npm/deepdash/)

## Methods
(links to docs)
- [condense](https://deepdash.io/#condense) - condense sparse array
- [condenseDeep](https://deepdash.io/#condensedeep) - condense all the nested arrays
- [eachDeep](https://deepdash.io/#eachdeep-foreachdeep) - (forEachDeep) iterate over all the children and sub-children
- [exists](https://deepdash.io/#exists) - like a `_.has` but returns `false` for empty array slots
- [filterDeep](https://deepdash.io/#filterdeep) - deep filter object
- [indexate](https://deepdash.io/#indexate) - get an object with all the paths as keys and corresponding values
- [omitDeep](https://deepdash.io/#omitdeep) - get object without keys specified as string name or regex
- [paths](https://deepdash.io/#paths-keysdeep) - (keysDeep) get an array of paths
- [pathToString](https://deepdash.io/#pathtostring) - convert an array to string path (opposite to _.toPath)

### Installation
In a browser load [script](https://cdn.jsdelivr.net/npm/deepdash/deepdash.min.js) after Lodash:
```html
<script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/deepdash/deepdash.min.js"></script>
```
Using npm:
```
npm i --save deepdash
```
In Node.js (same for the Angular component):
```js
//mixin new methods into Lodash object
const _ = require('deepdash')(require('lodash'));
```
Or as [ECMAScript Module](https://nodejs.org/api/esm.html#esm_ecmascript_modules):
```js
import lodash from "lodash";
import deepdash from "deepdash";
const _ = deepdash(lodash);
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
_.eachDeep(obj, (value, key, parent, context) => {
  console.log(
    _.repeat('  ', context.depth) +
      key +
      ':' +
      (value === null ? 'null' : typeof value),
    context.parent.path && ' @' + context.parent.path
  );
  if (key == 'skip') {
    return false; // return false explicitly to skip iteration over current value's children
  }
});
```
Console:
```json
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
  _(obj).eachDeep((value, key, parent, context) => {/* do */}).value();
```

### See [docs](https://deepdash.io) for details.