import getEachDeep from './getEachDeep.js';

export default function getIndex(_) {
  var eachDeep = getEachDeep(_);

  function index(obj, options) {
    options = _.merge(
      {
        checkCircular: false,
        includeCircularPath: true,
        leavesOnly: !options || options.childrenPath === undefined,
      },
      options || {}
    );
    if (options && options.leafsOnly !== undefined) {
      options.leavesOnly = options.leafsOnly;
    }
    var eachDeepOptions = {
      pathFormat: 'string',
      checkCircular: options.checkCircular,
      ownPropertiesOnly: options.ownPropertiesOnly,
      includeRoot: options.includeRoot,
      childrenPath: options.childrenPath,
      rootIsChildren: options.rootIsChildren,
      leavesOnly: options.leavesOnly,
    };
    var res = {};
    eachDeep(
      obj,
      function (value, key, parent, context) {
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
