'use strict';

var getEachDeep = require('./getEachDeep.js');

function getPaths(_) {
  var eachDeep = getEachDeep(_);
  function paths(obj, options) {
    if (options && options.leafsOnly !== undefined) {
      options.leavesOnly = options.leafsOnly;
    }
    options = _.merge(
      {
        checkCircular: false,
        includeCircularPath: true,
        leavesOnly: !options || options.childrenPath === undefined,
        pathFormat: 'string',
      },
      options || {}
    );
    var eachDeepOptions = {
      pathFormat: options.pathFormat,
      checkCircular: options.checkCircular,
      ownPropertiesOnly: options.ownPropertiesOnly,
      includeRoot: options.includeRoot,
      childrenPath: options.childrenPath,
      rootIsChildren: options.rootIsChildren,
      leavesOnly: options.leavesOnly,
    };
    var res = [];
    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (!context.isCircular || options.includeCircularPath) {
          if (context.path !== undefined) {
            res.push(context.path);
          }
        }
      },
      eachDeepOptions
    );
    return res;
  }
  return paths;
}

module.exports = getPaths;
