'use strict';

var getCondense = require('./getCondense.js');
var isObject = require('./private/isObject.js');
var getEachDeep = require('./getEachDeep.js');

function getFilterDeep(_) {
  var eachDeep = getEachDeep(_);
  var condense = getCondense();

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
      ownPropertiesOnly: options.ownPropertiesOnly,
      callbackAfterIterate: true,
      leavesOnly: false,
    };
    var resIsArray = Array.isArray(obj);
    var res = resIsArray ? [] : isObject(obj) ? {} : null;
    var toCondense = options.condense ? [] : false;
    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (!context.afterIterate) {
          context.info._filterDeep = {};
          if (!context.isCircular) {
            var reply =
              !options.leavesOnly || context.isLeaf
                ? predicate(value, key, parent, context)
                : undefined;

            if (!isObject(reply)) {
              if (reply === undefined) {
                reply = options.onUndefined;
              } else if (reply) {
                reply = options.onTrue;
              } else {
                reply = options.onFalse;
              }
            }
            context.info._filterDeep.reply = reply;
            context.info._filterDeep.empty =
              reply.empty === undefined ? true : reply.empty;

            if (reply.keepIfEmpty || !reply.skipChildren) {
              if (options.cloneDeep && reply.cloneDeep) {
                if (context.path !== undefined) {
                  var children = takeResultParent(context, res);
                  context.info._filterDeep.res = children[
                    key
                  ] = options.cloneDeep(value);
                } else {
                  context.info._filterDeep.res = res = options.cloneDeep(value);
                }
              } else {
                if (context.path !== undefined) {
                  var children$1 = takeResultParent(context, res);
                  context.info._filterDeep.res = children$1[key] = context.info
                    .isArray
                    ? []
                    : context.info.isObject
                    ? {}
                    : value;
                } else {
                  context.info._filterDeep.res = res = context.info.isArray
                    ? []
                    : context.info.isObject
                    ? {}
                    : value;
                }
              }
            }
            return !reply.skipChildren;
          } else {
            var children$2 = takeResultParent(context, res);
            if (!options.keepCircular) {
              delete children$2[key];
              if (
                toCondense &&
                ((children$2 === context.parent.info._filterDeep.res &&
                  context.parent.info.isArray) ||
                  Array.isArray(children$2)) &&
                !context.parent.info._filterDeep.isSparse
              ) {
                context.parent.info._filterDeep.isSparse = true;
                toCondense.push(context.parent.info);
              }

              context.info._filterDeep.excluded = true;
            } else {
              context.info._filterDeep.res = children$2[key] =
                'replaceCircularBy' in options
                  ? options.replaceCircularBy
                  : context.circularParent.path !== undefined
                  ? context.circularParent.info._filterDeep.res
                  : res;
            }
            return false;
          }
        } else if (context.afterIterate && !context.isCircular) {
          var reply$1 = context.info._filterDeep.reply;

          if (context.info._filterDeep.empty && !reply$1.keepIfEmpty) {
            if (context.path === undefined) {
              res = null;
            } else {
              var children$3 = takeResultParent(context, res);
              delete children$3[key];
              if (
                toCondense &&
                ((children$3 === context.parent.info._filterDeep.res &&
                  context.parent.info.isArray) ||
                  Array.isArray(children$3)) &&
                !context.parent.info._filterDeep.isSparse
              ) {
                context.parent.info._filterDeep.isSparse = true;
                toCondense.push(context.parent.info);
              }
              context.info._filterDeep.excluded = true;
            }
          } else {
            var parent$1 = context.parent;
            while (parent$1) {
              // if (!parent.info._filterDeep) {
              //   parent.info._filterDeep = {};
              // }
              if (!parent$1.info._filterDeep.reply) {
                parent$1.info._filterDeep.reply = options.onUndefined;
              }
              if (!parent$1.info._filterDeep.empty) {
                break;
              }
              parent$1.info._filterDeep.empty = false;
              parent$1 = parent$1.parent;
            }
          }

          return;
        }
      },
      eachDeepOptions
    );

    if (toCondense) {
      for (var i = 0; i < toCondense.length; i++) {
        var info = toCondense[i];
        if (info._filterDeep.isSparse && !info._filterDeep.excluded) {
          condense(info.children);
        }
      }
      if (resIsArray) {
        condense(res);
      }
    }
    if (resIsArray && !res.length && !eachDeepOptions.includeRoot) {
      return null;
    }

    return res;
  }
  return filterDeep;

  function takeResultParent(context, res) {
    if (context.parent.info.children) {
      return context.parent.info.children;
    }
    if (!context.parent.info._filterDeep) {
      context.parent.info._filterDeep = {};
    }
    var parent = context.parent.info._filterDeep.res;
    if (parent === undefined) {
      //if (!context.parent.parent) {
      parent = context.parent.info._filterDeep.res = res;
      // } else {
      //   parent = context.parent.info._filterDeep.res = Array.isArray(context.parent.value)
      //     ? []
      //     : {};
      // }
    }
    if (context._item.childrenPath) {
      var oParent = context.parent.value;
      for (var i = 0; i < context._item.childrenPath.length; i++) {
        var childKey = context._item.childrenPath[i];
        oParent = oParent[childKey];
        if (!parent[childKey]) {
          parent[childKey] = Array.isArray(oParent) ? [] : {};
        }
        parent = parent[childKey];
      }
    }
    context.parent.info.children = parent;
    return parent;
  }
}

module.exports = getFilterDeep;
