const _ = require('../deepdash')(require('lodash'));

var { demo, circular, objectChildrenDeeper } = require('./object')();

function isNS(value, key, parent, ctx) {
  let t = typeof value;
  return t == 'number' || t == 'string';
}

let filtrate = _.filterDeep(
  {
    children: {
      values: { objectChildrenDeeper },
    },
  },
  ['name', 'child 1.2.1'],
  {
    childrenPath: 'children.values',
  }
);
