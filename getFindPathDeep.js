'use strict';

var getFindDeep = require('./getFindDeep.js');

function getFindPathDeep(_) {
  var findDeep = getFindDeep(_);
  function findPathDeep(obj, predicate, options) {
    var res = findDeep(obj, predicate, options);
    return res && res.context.path;
  }
  return findPathDeep;
}

module.exports = getFindPathDeep;
