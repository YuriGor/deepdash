import getEachDeep from './getEachDeep';

export default function getMapValuesDeep(_) {
  var eachDeep = getEachDeep(_);

  function mapValuesDeep(obj, iteratee, options) {
    iteratee = _.iteratee(iteratee);
    var res = Array.isArray(obj) ? [] : _.isObject(obj) ? {} : _.clone(obj);
    eachDeep(
      obj,
      function(value, key, parent, context) {
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
  return mapValuesDeep;
}
