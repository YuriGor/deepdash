'use strict';

var getEachDeep = require('./getEachDeep.js');

function getFindDeep(_) {
  var eachDeep = getEachDeep(_);

  function findDeep(obj, predicate, options) {
    predicate = _.iteratee(predicate);
    if (!options) {
      options = {};
    } else {
      options = _.cloneDeep(options);
      if (options.leafsOnly !== undefined) {
        options.leavesOnly = options.leafsOnly;
      }
    }

    options = _.merge(
      {
        checkCircular: false,
        leavesOnly: options.childrenPath === undefined,
        pathFormat: 'string',
      },
      options
    );

    var eachDeepOptions = {
      pathFormat: options.pathFormat,
      checkCircular: options.checkCircular,
      ownPropertiesOnly: options.ownPropertiesOnly,
      childrenPath: options.childrenPath,
      includeRoot: options.includeRoot,
      rootIsChildren: options.rootIsChildren,
      callbackAfterIterate: false,
      leavesOnly: options.leavesOnly,
    };

    var res;

    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (predicate(value, key, parent, context)) {
          res = { value: value, key: key, parent: parent, context: context };
          return context['break']();
        }
      },
      eachDeepOptions
    );
    return res;
  }
  return findDeep;
}

module.exports = getFindDeep;
