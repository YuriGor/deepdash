import getEachDeep from './getEachDeep.js';
import getCondense from './getCondense.js';

export default function getCondenseDeep(_) {
  var eachDeep = getEachDeep(_);
  var condense = getCondense(_);
  var _each = _.each || _.forArray;
  function condenseDeep(obj, options) {
    options = _.merge(
      {
        checkCircular: false,
      },
      options || {}
    );
    var eachDeepOptions = {
      checkCircular: options.checkCircular,
      ownPropertiesOnly: options.ownPropertiesOnly,
    };
    var arrays = [];
    //console.log('condenseDeep → eachDeep');
    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (!context.isCircular && Array.isArray(value)) arrays.push(value);
      },
      eachDeepOptions
    );
    if (Array.isArray(obj)) arrays.push(obj);
    _each(arrays, condense);
    return obj;
  }
  return condenseDeep;
}
