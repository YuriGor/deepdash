'use strict';

var getEachDeep = require('./getEachDeep.js');

function getIndex(_) {
  var eachDeep = getEachDeep(_);

  function index(obj, options) {
    if (options && options.leafsOnly !== undefined) {
      options.leavesOnly = options.leafsOnly;
    }

    options = _.merge(
      {
        checkCircular: false,
        includeCircularPath: true,
        leavesOnly: !options || options.childrenPath === undefined,
      },
      options || {}
    );
    var eachDeepOptions = {
      pathFormat: 'string',
      checkCircular: options.checkCircular,
      childrenPath: options.childrenPath,
      includeRoot: options.includeRoot,
      leavesOnly: options.leavesOnly,
    };
    var res = {};
    eachDeep(
      obj,
      function(value, key, parent, context) {
        if (!context.isCircular || options.includeCircularPath) {
          if (context.path !== undefined) {
            res[context.path] = value;
          }
        }
      },
      eachDeepOptions
    );
    return res;
  }
  return index;
}

module.exports = getIndex;
