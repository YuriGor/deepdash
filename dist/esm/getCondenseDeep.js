import getCondense from './getCondense.js';
import './getPathToString.js';
import getEachDeep from './getEachDeep.js';

function getCondenseDeep(_) {
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
    };
    var arrays = [];
    //console.log('condenseDeep → eachDeep');
    eachDeep(
      obj,
      function(value, key, parent, context) {
        if (!context.isCircular && _.isArray(value)) arrays.push(value);
      },
      eachDeepOptions
    );
    if (_.isArray(obj)) arrays.push(obj);
    _each(arrays, condense);
    return obj;
  }
  return condenseDeep;
}

export default getCondenseDeep;
