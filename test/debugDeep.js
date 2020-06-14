const _ = require('../deepdash')(require('lodash'));
var { demo } = require('./object')();
let filtrate = _.filterDeep([demo], (value, key, parent, ctx) => {
  let t = typeof value;
  return t == 'number' || t == 'string';
});
