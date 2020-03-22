'use strict';

var getReduceDeep = require('./getReduceDeep.js');

function getMapDeep(_) {
  var reduceDeep = getReduceDeep(_);

  function mapDeep(obj, iteratee, options) {
    iteratee = _.iteratee(iteratee);
    return reduceDeep(
      obj,
      function (acc, value, key, parentValue, context) {
        acc.push(iteratee(value, key, parentValue, context));
        return acc;
      },
      [],
      options
    );
  }
  return mapDeep;
}

module.exports = getMapDeep;
