"use strict";

//inject new method into lodash object
const _ = require('./deepdash')(require('lodash'));
//in browser just load script after lodash
//<script src="lodash.js"></script>
//<script src="deepdash.js"></script>
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

// Chaining works too
// _(obj).eachDeep((value, key, path, depth, parent, parentKey, parentPath) => {/* do */}).value();
