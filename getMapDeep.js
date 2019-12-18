'use strict';

var getEachDeep = require('./getEachDeep.js');

function getMapDeep(_) {
  var eachDeep = getEachDeep(_);

  function mapDeep(obj, iteratee, options) {
    iteratee = _.iteratee(iteratee);
    var res = _.isArray(obj) ? [] : _.isObject(obj) ? {} : _.clone(obj);
    eachDeep(
      obj,
      function(value, key, parent, context) {
        delete context['break'];
        var r = iteratee(value, key, parent, context);
        if (key === undefined) {
          res = r;
        } else {
          _.set(res, context.path, r);
        }
      },
      options
    );
    return res;
  }
  return mapDeep;
}

module.exports = getMapDeep;
