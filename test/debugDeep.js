/*'use strict';
var {
  demo,
  circular,
  comments,
  children,
  verifiedComments,
} = require('./object');
const _ = require('../deepdash')(require('lodash'));
function isNS(value, key, parent, ctx) {
  let t = typeof value;
  // console.log(`@${ctx.path}`, t == 'number' || t == 'string' ? value : false);
  return t == 'number' || t == 'string';
}

let obj = [{ v: true }, { v: false }];
let filtrate = _.filterDeep(obj, (v) => (v === true ? true : undefined), {
  leavesOnly: false,
  condense: false,
});
// console.log(filtrate);

// var o = undefined;
// _.unset(o, 'a.b.c');
// console.log(o);
*/
