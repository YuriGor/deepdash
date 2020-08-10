'use strict';

var getEachDeep = require('./getEachDeep.js');

function getMapValuesDeep(_) {
  var eachDeep = getEachDeep(_);

  function mapValuesDeep(obj, iteratee, options) {
    iteratee = _.iteratee(iteratee);
    var res = Array.isArray(obj) ? [] : _.isObject(obj) ? {} : _.clone(obj);
    var skipChildren;

    eachDeep(
      obj,
      function (value, key, parent, context) {
        // if (!context.skipChildren) {
        context.skipChildren = function (skip) {
          skipChildren = skip;
        };
        // }
        skipChildren = undefined;
        var r = iteratee(value, key, parent, context);
        if (!context.isLeaf && skipChildren === undefined) {
          skipChildren =
            value !== r && Array.isArray(value) != Array.isArray(r);
        }
        if (context.path !== undefined) {
          _.set(res, context.path, r);
        } else {
          res = r;
        }
        if (skipChildren) {
          return false;
        }
      },
      options
    );

    return res;
  }
  return mapValuesDeep;
}

module.exports = getMapValuesDeep;
