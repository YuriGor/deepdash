const _ = require('../deepdash')(require('lodash'));

var { children, demo, circular, objectChildrenDeeper } = require('./object')();

function isNS(value, key, parent, ctx) {
  let t = typeof value;
  return t == 'number' || t == 'string';
}

// let filtrate = _.filterDeep(
//   {
//     children: {
//       values: { objectChildrenDeeper },
//     },
//   },
//   ['name', 'child 1.2.1'],
//   {
//     childrenPath: 'children.values',
//   }
// );

// let visited = [];
// let options = { childrenPath: 'children', pathFormat: 'array' };
// _.eachDeep(
//   children,
//   (value, key, parent, ctx) => {
//     visited.push(ctx.path);
//   },
//   options
// );
// console.log(visited);
