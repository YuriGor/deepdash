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

    // make sure to use this as a root in takeResultParent
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
                reply = options.onUndefined;
              } else if (reply) {
                reply = options.onTrue;
              } else {
                reply = options.onFalse;
              }
            }
            context.info.reply = reply;
            context.info.empty = reply.empty === undefined ? true : reply.empty;

            if (reply.keepIfEmpty || !reply.skipChildren) {
              if (options.cloneDeep && reply.cloneDeep) {
                if (context.path !== undefined) {
                  let parent = takeResultParent(context, res);
                  context.info.res = parent[key] = options.cloneDeep(value);
                  // _.set(res, context.path, options.cloneDeep(value));
                } else {
                  context.info.res = res = options.cloneDeep(value);
                }
              } else {
                if (context.path !== undefined) {
                  let parent = takeResultParent(context, res);
                  context.info.res = parent[key] = Array.isArray(value)
                    ? []
                    : _.isObject(value)
                    ? {}
                    : value;
                } else {
                  context.info.res = res = Array.isArray(value)
                    ? []
                    : _.isObject(value)
                    ? {}
                    : value;
                }
              }
            }
            return !reply.skipChildren;
          } else {
            let parent = takeResultParent(context, res);
            if (!options.keepCircular) {
              delete parent[key];
            } else {
              context.info.res = parent[key] =
                'replaceCircularBy' in options
                  ? options.replaceCircularBy
                  : context.circularParent.path !== undefined
                  ? context.circularParent.info.res
                  : res;
            }
            return false;
          }
        } else if (context.afterIterate && !context.isCircular) {
          const reply = context.info.reply;

          if (context.info.empty && !reply.keepIfEmpty) {
            if (context.path === undefined) {
              res = null;
            } else {
              let parent = takeResultParent(context, res);
              delete parent[key];
            }
          } else {
            let parent = context.parent;
            while (parent) {
              if (!parent.info.reply) {
                parent.info.reply = _.clone(options.onUndefined);
              }
              if (!parent.info.empty) {
                break;
              }
              parent.info.empty = false;
              parent = parent.parent;
            }
          }

          return;
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

  function takeResultParent(context, res) {
    let parent = context.parent.info.res;
    if (parent === undefined) {
      //if (!context.parent.parent) {
      parent = context.parent.info.res = res;
      // } else {
      //   parent = context.parent.info.res = Array.isArray(context.parent.value)
      //     ? []
      //     : {};
      // }
    }
    if (context._item.childrenPath) {
      let oParent = context.parent.value;
      for (var i = 0; i < context._item.childrenPath.length; i++) {
        const childKey = context._item.childrenPath[i];
        oParent = oParent[childKey];
        if (!parent[childKey]) {
          parent[childKey] = Array.isArray(oParent) ? [] : {};
        }
        parent = parent[childKey];
      }
    }
    return parent;
  }
}
