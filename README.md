## deepdash
tree traversal for lodash
### Installation
In a browser load script after lodash:
```html
<script src="lodash.js"></script>
<script src="deepdash.js"></script>
```
Using npm:
```
npm i --save deepdash
```
In Node.js:
```js
//inject new method into lodash object
const _ = require('./deepdash')(require('lodash'));
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
    return false;//return false explicitly to skip iteration over current value's children
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

### Other traversal methods
Feel free to request other methods implementation like `filterDeep`, `mapDeep` and soon.