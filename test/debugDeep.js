'use strict';
var { demo, circular } = require('./object');
const _ = require('../deepdash')(require('lodash'));
function isNS(value, key, parent, ctx) {
  let t = typeof value;
  console.log(`@${ctx.path}`, t == 'number' || t == 'string' ? value : false);
  return t == 'number' || t == 'string';
}

let obj = [[1]];
let filtrate = _.filterDeep(obj, isNS, {
  cloneDeep: false,
  leavesOnly: false,
  onFalse: { skipChildren: false },
});
console.log(JSON.stringify(filtrate, null, 2));
