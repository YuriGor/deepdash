const _ = require('../deepdash')(require('lodash'));

var {
  children,
  demo,
  circular,
  circularArrayParent,
  objectChildrenDeeper,
} = require('./object')();

let options = {
  checkCircular: true,
  keepCircular: false,
  leavesOnly: true,
};
let filtrate = _.filterDeep(
  circularArrayParent,
  (v, k, p, x) => (x.isCircular || isNS(v, k, p, x)) && v !== 1,
  options
);

function isNS(value, key, parent, ctx) {
  let t = typeof value;
  return t == 'number' || t == 'string';
}

// let filtrate = _.filterDeep(children, ['name', 'child 1.2.1'], {
//   childrenPath: 'children',
// });

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
