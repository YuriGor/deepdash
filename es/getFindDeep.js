import getEachDeep from './getEachDeep.js';

export default function getFindDeep(_) {
  const eachDeep = getEachDeep(_);

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

    const eachDeepOptions = {
      pathFormat: options.pathFormat,
      checkCircular: options.checkCircular,
      ownPropertiesOnly: options.ownPropertiesOnly,
      childrenPath: options.childrenPath,
      includeRoot: options.includeRoot,
      rootIsChildren: options.rootIsChildren,
      callbackAfterIterate: false,
      leavesOnly: options.leavesOnly,
    };

    let res;

    eachDeep(
      obj,
      (value, key, parent, context) => {
        if (predicate(value, key, parent, context)) {
          res = { value, key, parent, context };
          return context['break']();
        }
      },
      eachDeepOptions
    );
    return res;
  }
  return findDeep;
}
