'use strict';

var getEachDeep = require('./getEachDeep.js');

function getReduceDeep(_) {
  var eachDeep = getEachDeep(_);

  function reduceDeep(obj, iteratee, accumulator, options) {
    var accumulatorInited = accumulator !== undefined;
    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (!accumulatorInited) {
          accumulator = value;
          accumulatorInited = true;
        } else {
          accumulator = iteratee(accumulator, value, key, parent, context);
        }
      },
      options
    );
    return accumulator;
  }
  return reduceDeep;
}

module.exports = getReduceDeep;
