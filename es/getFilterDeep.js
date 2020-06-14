import getEachDeep from './getEachDeep';
import getCondenseDeep from './getCondenseDeep';

export default function getFilterDeep(_) {
  // console.log('getFilterDeep:', _);
  var eachDeep = getEachDeep(_);
  var condenseDeep = getCondenseDeep(_);

  function filterDeep(obj, predicate, options) {
    predicate = _.iteratee(predicate);
    if (!options) {
      options = {};
    } else {
      options = _.cloneDeep(options);
      if (options.leafsOnly !== undefined) {
        options.leavesOnly = options.leafsOnly;
      }
    }
    if (!options.onTrue) {
      options.onTrue = {};
    }
    if (!options.onFalse) {
      options.onFalse = {};
    }
    if (!options.onUndefined) {
      options.onUndefined = {};
    }
    if (options.childrenPath !== undefined) {
      if (options.onTrue.skipChildren === undefined) {
        options.onTrue.skipChildren = false;
      }
      if (options.onUndefined.skipChildren === undefined) {
        options.onUndefined.skipChildren = false;
      }
      if (options.onFalse.skipChildren === undefined) {
        options.onFalse.skipChildren = false;
      }

      if (options.onTrue.cloneDeep === undefined) {
        options.onTrue.cloneDeep = true;
      }
      if (options.onUndefined.cloneDeep === undefined) {
        options.onUndefined.cloneDeep = true;
      }
      if (options.onFalse.cloneDeep === undefined) {
        options.onFalse.cloneDeep = true;
      }
    }
    options = _.merge(
      {
        checkCircular: false,
        keepCircular: true,
        //replaceCircularBy: <by>,
        leavesOnly: options.childrenPath === undefined,
        condense: true,
        cloneDeep: _.cloneDeep,
        pathFormat: 'string',
        onTrue: { skipChildren: true, cloneDeep: true, keepIfEmpty: true },
        onUndefined: {
          skipChildren: false,
          cloneDeep: false,
          keepIfEmpty: false,
        },
        onFalse: {
          skipChildren: true,
          cloneDeep: false,
          keepIfEmpty: false,
        },
      },
      options
    );

    var eachDeepOptions = {
      pathFormat: options.pathFormat,
      checkCircular: options.checkCircular,
      childrenPath: options.childrenPath,
      includeRoot: options.includeRoot,
      rootIsChildren: options.rootIsChildren,
      callbackAfterIterate: true,
      leavesOnly: false,
    };

    var res = Array.isArray(obj) ? [] : _.isObject(obj) ? {} : null;

    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (!context.afterIterate) {
          if (!context.isCircular) {
            var reply =
              !options.leavesOnly || context.isLeaf
                ? predicate(value, key, parent, context)
                : undefined;

            if (!_.isObject(reply)) {
              if (reply === undefined) {
                reply = _.clone(options.onUndefined);
              } else if (reply) {
                reply = _.clone(options.onTrue);
              } else {
                reply = _.clone(options.onFalse);
              }
            }
            if (reply.empty === undefined) {
              reply.empty = true;
            }

            context.info.reply = reply;

            if (reply.keepIfEmpty || !reply.skipChildren) {
              if (options.cloneDeep && reply.cloneDeep) {
                if (context.path !== undefined) {
                  _.set(res, context.path, options.cloneDeep(value));
                } else {
                  res = options.cloneDeep(value);
                }
              } else {
                if (context.path !== undefined) {
                  _.set(
                    res,
                    context.path,
                    Array.isArray(value) ? [] : _.isObject(value) ? {} : value
                  );
                } else {
                  res = Array.isArray(value)
                    ? []
                    : _.isObject(value)
                    ? {}
                    : value;
                }
              }
            }
            return !reply.skipChildren;
          } else {
            if (!options.keepCircular) {
              _.unset(res, context.path);
            } else {
              _.set(
                res,
                context.path,
                _.has(options, 'replaceCircularBy')
                  ? options.replaceCircularBy
                  : context.circularParent.path !== undefined
                  ? _.get(res, context.circularParent.path)
                  : res
              );
            }
            return false;
          }
        } else if (context.afterIterate && !context.isCircular) {
          const reply = context.info.reply;

          if (reply.empty && !reply.keepIfEmpty) {
            if (context.path === undefined) {
              res = null;
            } else {
              _.unset(res, context.path);
            }
          } else {
            let parent = context.parent;
            while (parent) {
              if (!parent.info.reply) {
                parent.info.reply = _.clone(options.onUndefined);
              }
              if (!parent.info.reply.empty) {
                break;
              }
              parent.info.reply.empty = false;
              parent = parent.parent;
            }
          }

          return;
        } else {
        }
      },
      eachDeepOptions
    );

    if (options.condense) {
      res = condenseDeep(res, { checkCircular: options.checkCircular });
    }
    if (Array.isArray(res) && !res.length && !eachDeepOptions.includeRoot)
      return null;
    return res;
  }
  return filterDeep;
}
