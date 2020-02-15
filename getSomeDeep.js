'use strict';

var getFindDeep = require('./getFindDeep.js');

function getSomeDeep(_) {
  var findDeep = getFindDeep(_);
  function someDeep(obj, predicate, options) {
    return !!findDeep(obj, predicate, options);
  }
  return someDeep;
}

module.exports = getSomeDeep;
