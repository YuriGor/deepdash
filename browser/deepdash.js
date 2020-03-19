var deepdash = (function () {
  'use strict';

  function getMixOrPatchIn(_) {
    function mixOrPatchIn(name, method, chain) {
      if (!_[name]) {
        if (_.mixin) {
          var patch = {};
          patch[name] = method;
          _.mixin(patch, { chain: chain });
        } else {
          _[name] = method;
        }
      }
      return _;
    }
    return mixOrPatchIn;
  }

  function getCondense(_) {
    function condense(arr) {
      var indexes = [];
      for (var i = 0; i < arr.length; i++) {
        if (!(i in arr)) {
          indexes.push(i);
        }
      }
      var length = indexes.length;

      while (length--) {
        arr.splice(indexes[length], 1);
      }
      return arr;
    }
    return condense;
  }

  /* build/tpl */

  function addCondense(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('condense', getCondense(), !getCondense.notChainable);
  }

  var rxArrIndex = /^\d+$/;
  var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;

  function getPathToString(_) {
    function pathToString(path) {
      if (_.isString(path)) { return path; }
      if (!_.isArray(path)) { return undefined; }
      return _.reduce(
        path,
        function(accumulator, value) {
          if (rxArrIndex.test(value)) {
            return accumulator + '[' + value + ']';
          }
          if (rxVarName.test(value)) {
            return accumulator + (accumulator ? '.' : '') + value;
          }
          return (
            accumulator + '["' + value.toString().replace(/"/g, '\\"') + '"]'
          );
        },
        ''
      );
    }
    return pathToString;
  }

  getPathToString.notChainable = true;

  function getHasChildren(_) {
    function hasChildren(obj, childrenPath) {
      return _.some(childrenPath, function (cp) {
        var children = _.get(obj, cp);
        return !_.isEmpty(children);
      });
    }
    return hasChildren;
  }

  function getIterate(_) {
    var pathToString = getPathToString(_);
    var hasChildren = getHasChildren(_);
    var _each = _.each || _.forArray;
    function iterate(
      value,
      callback,
      options,
      key,
      path,
      depth,
      parent,
      parents,
      obj,
      childrenPath
    ) {
      if (options['break']) { return; }
      var currentObj = {
        value: value,
        key: key,
        path: options.pathFormat == 'array' ? path : pathToString(path),
        parent: parent,
      };

      var currentParents = parents.concat( [currentObj]);

      var isCircular = undefined;
      var circularParentIndex = undefined;
      var circularParent = undefined;
      if (options.checkCircular) {
        if (_.isObject(value) && !_.isEmpty(value)) {
          circularParentIndex = _.findIndex(parents, function(v) {
            return v.value === value;
          });
          circularParent = parents[circularParentIndex] || null;
        } else {
          circularParentIndex = -1;
          circularParent = null;
        }
        isCircular = circularParentIndex !== -1;
      }
      var res;
      var isLeaf =
        !_.isObject(value) ||
        _.isEmpty(value) ||
        isCircular ||
        (options.childrenPath !== undefined &&
          !hasChildren(value, options.childrenPath));
      var needCallback =
        (depth || options.includeRoot) && (!options.leavesOnly || isLeaf);
      // console.log('needCallback?', needCallback);
      if (needCallback) {
        var context = {
          path: options.pathFormat == 'array' ? path : pathToString(path),
          parent: parent,
          parents: parents,
          obj: obj,
          depth: depth,
          isCircular: isCircular,
          circularParent: circularParent,
          circularParentIndex: circularParentIndex,
          isLeaf: isLeaf,
          "break": function () {
            options['break'] = true;
            return false;
          },
        };
        if (options.childrenPath !== undefined) {
          currentObj.childrenPath =
            options.pathFormat == 'array'
              ? childrenPath
              : pathToString(childrenPath);
          context.childrenPath = currentObj.childrenPath;
        }
        try {
          res = callback(value, key, parent && parent.value, context);
        } catch (err) {
          if (err.message) {
            err.message += "\ncallback failed before deep iterate at:\n" + (context.path);
          }
          throw err;
        }
      }
      if (
        !options['break'] &&
        res !== false &&
        !isCircular &&
        _.isObject(value)
      ) {
        if (options.childrenPath !== undefined) {
          function forChildren(children, cp) {
            if (children && _.isObject(children)) {
              _.forOwn(children, function(childValue, childKey) {
                var childPath = (path || []).concat( (cp || []), [childKey]);

                iterate(
                  childValue,
                  callback,
                  options,
                  childKey,
                  childPath,
                  depth + 1,
                  currentObj,
                  currentParents,
                  obj,
                  cp
                );
              });
            }
          }

          if (!depth && options.rootIsChildren) {
            forChildren(value, undefined);
          } else {
            _each(options.childrenPath, function(cp) {
              var children = _.get(value, cp);
              forChildren(children, cp);
            });
          }
        } else {
          _.forOwn(value, function(childValue, childKey) {
            if (_.isArray(value)) {
              if (childValue === undefined && !(childKey in value)) {
                return; //empty slot
              }
            }

            var childPath = (path || []).concat( [childKey]);

            iterate(
              childValue,
              callback,
              options,
              childKey,
              childPath,
              depth + 1,
              currentObj,
              currentParents,
              obj
            );
          });
        }
      }
      if (options.callbackAfterIterate && needCallback) {
        context.afterIterate = true;
        try {
          callback(value, key, parent && parent.value, context);
        } catch (err) {
          if (err.message) {
            err.message += "\ncallback failed after deep iterate at:\n" + (context.path);
          }
          throw err;
        }
      }
    }
    return iterate;
  }

  function getEachDeep(_) {
    var iterate = getIterate(_);

    function eachDeep(obj, callback, options) {
      if (callback === undefined) { callback = _.identity; }
      options = _.merge(
        {
          includeRoot: !_.isArray(obj),
          pathFormat: 'string',
          checkCircular: false,
          leavesOnly: false,
        },
        options || {}
      );
      if (options.childrenPath !== undefined) {
        if (!options.includeRoot && options.rootIsChildren === undefined) {
          options.rootIsChildren = _.isArray(obj);
        }
        if (
          !_.isString(options.childrenPath) &&
          !_.isArray(options.childrenPath)
        ) {
          throw Error('childrenPath can be string or array');
        } else {
          if (_.isString(options.childrenPath)) {
            options.childrenPath = [options.childrenPath];
          }
          for (var i = options.childrenPath.length - 1; i >= 0; i--) {
            options.childrenPath[i] = _.toPath(options.childrenPath[i]);
          }
        }
      }
      iterate(
        obj,
        callback,
        options,
        undefined,
        undefined,
        0,
        undefined,
        [],
        obj
      );
      return obj;
    }
    return eachDeep;
  }

  function getCondenseDeep(_) {
    var eachDeep = getEachDeep(_);
    var condense = getCondense();
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
          if (!context.isCircular && _.isArray(value)) { arrays.push(value); }
        },
        eachDeepOptions
      );
      if (_.isArray(obj)) { arrays.push(obj); }
      _each(arrays, condense);
      return obj;
    }
    return condenseDeep;
  }

  /* build/tpl */

  function addCondenseDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('condenseDeep', getCondenseDeep(_), !getCondenseDeep.notChainable);
  }

  /* build/tpl */

  function addEachDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('eachDeep', getEachDeep(_), !getEachDeep.notChainable);
  }

  function getExists(_) {
    function exists(obj, path) {
      path = _.isArray(path) ? _.clone(path) : _.toPath(path);
      var key = path.pop();
      var parent = path.length ? _.get(obj, path) : obj;
      return parent !== undefined && key in parent;
    }
    return exists;
  }

  getExists.notChainable = true;

  /* build/tpl */

  function addExists(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('exists', getExists(_), !getExists.notChainable);
  }

  function getFilterDeep(_) {
    // console.log('getFilterDeep:', _);
    var eachDeep = getEachDeep(_);
    var pathToString = getPathToString(_);
    var condenseDeep = getCondenseDeep(_);
    var exists = getExists(_);

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

      var res = _.isArray(obj) ? [] : _.isObject(obj) ? {} : null;
      var replies = {};
      var rootReply;
      var foundCircular = [];
      // console.log('filterDeep → eachDeep', eachDeepOptions);
      eachDeep(
        obj,
        function(value, key, parent, context) {
          delete context['break'];
          var curPath = pathToString(context.path);
          if (!context.afterIterate) {
            if (!context.isCircular) {
              // console.log(context.path, { leaf: context.isLeaf });
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
              // console.log(context.path + '?', reply);
              if (curPath !== undefined) {
                replies[curPath] = reply;

                // _.eachRight(context.parents, function(parent) {
                //   var p = pathToString(parent.path);
                //   if (p !== undefined && !replies[p]) {
                //     replies[p] = _.clone(options.onUndefined);
                //     replies[p].empty = reply.empty;
                //   } else {
                //     return false;
                //   }
                // });

                if (!rootReply) {
                  rootReply = {
                    skipChildren: false,
                    cloneDeep: false,
                    keepIfEmpty: false,
                    empty: reply.empty,
                  };
                }
              } else {
                rootReply = reply;
                // console.log('root reply', reply);
              }
              // console.log('→', replies);
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
                      _.isArray(value) ? [] : _.isPlainObject(value) ? {} : value
                    );
                  } else {
                    res = _.isArray(value)
                      ? []
                      : _.isPlainObject(value)
                      ? {}
                      : value;
                  }
                }
              }
              return !reply.skipChildren;
            } else {
              // console.log('fc: ', context.path);
              _.unset(res, context.path);

              if (options.keepCircular) {
                foundCircular.push([context.path, context.circularParent.path]);
              }
              return false;
            }
          } else if (context.afterIterate && !context.isCircular) {
            // console.log('ai: ', context.path);
            if (
              curPath === undefined &&
              rootReply.empty &&
              !rootReply.keepIfEmpty
            ) {
              res = null;
            } else if (
              curPath !== undefined &&
              replies[curPath].empty &&
              !replies[curPath].keepIfEmpty
            ) {
              // console.log('remove ' + context.path);
              _.unset(res, context.path);
            } else {
              _.eachRight(context.parents, function(parent) {
                var p = pathToString(parent.path);
                if (p !== undefined && replies[p].empty) {
                  replies[p].empty = false;
                } else {
                  return false;
                }
              });
              rootReply.empty = false;
            }
            // console.log('←', replies);
            return;
          }
        },
        eachDeepOptions
      );
      if (rootReply && rootReply.empty && !rootReply.keepIfEmpty) {
        res = null;
      }
      _.each(foundCircular, function(c) {
        var cv;
        var found = c[1] === undefined || exists(res, c[1]);
        if (!found) { return; }
        // console.log('circular: ', c[0], c[1]);
        if (_.has(options, 'replaceCircularBy')) {
          cv = options.replaceCircularBy;
        } else {
          cv = c[1] !== undefined ? _.get(res, c[1]) : res;
        }
        _.set(res, c[0], cv);
      });
      if (options.condense) {
        //console.log('filterDeep → condenseDeep');
        res = condenseDeep(res, { checkCircular: options.checkCircular });
      }
      if (_.isArray(res) && !res.length && !eachDeepOptions.includeRoot)
        { return null; }
      return res;
    }
    return filterDeep;
  }

  /* build/tpl */

  function addFilterDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('filterDeep', getFilterDeep(_), !getFilterDeep.notChainable);
  }

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

  /* build/tpl */

  function addFindDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('findDeep', getFindDeep(_), !getFindDeep.notChainable);
  }

  function getFindPathDeep(_) {
    var findDeep = getFindDeep(_);
    function findPathDeep(obj, predicate, options) {
      var res = findDeep(obj, predicate, options);
      return res && res.context.path;
    }
    return findPathDeep;
  }

  /* build/tpl */

  function addFindPathDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('findPathDeep', getFindPathDeep(_), !getFindPathDeep.notChainable);
  }

  function getFindValueDeep(_) {
    var findDeep = getFindDeep(_);
    function findValueDeep(obj, predicate, options) {
      var res = findDeep(obj, predicate, options);
      return res && res.value;
    }
    return findValueDeep;
  }

  /* build/tpl */

  function addFindValueDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('findValueDeep', getFindValueDeep(_), !getFindValueDeep.notChainable);
  }

  function getForEachDeep(_) {
    return getEachDeep(_);
  }

  /* build/tpl */

  function addForEachDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('forEachDeep', getForEachDeep(_), !getForEachDeep.notChainable);
  }

  function getIndex(_) {
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
        includeRoot: options.includeRoot,
        childrenPath: options.childrenPath,
        rootIsChildren: options.rootIsChildren,
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

  /* build/tpl */

  function addIndex(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('index', getIndex(_), !getIndex.notChainable);
  }

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
        includeRoot: options.includeRoot,
        childrenPath: options.childrenPath,
        rootIsChildren: options.rootIsChildren,
        leavesOnly: options.leavesOnly,
      };
      var res = [];
      eachDeep(
        obj,
        function(value, key, parent, context) {
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

  function getKeysDeep(_) {
    return getPaths(_);
  }

  /* build/tpl */

  function addKeysDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('keysDeep', getKeysDeep(_), !getKeysDeep.notChainable);
  }

  function getMapDeep(_) {
    var eachDeep = getEachDeep(_);

    function mapDeep(obj, iteratee, options) {
      iteratee = _.iteratee(iteratee);
      var res = _.isArray(obj) ? [] : _.isObject(obj) ? {} : _.clone(obj);
      eachDeep(
        obj,
        function(value, key, parent, context) {
          delete context['break'];
          var r = iteratee(value, key, parent, context);
          if (key === undefined) {
            res = r;
          } else {
            _.set(res, context.path, r);
          }
        },
        options
      );
      return res;
    }
    return mapDeep;
  }

  /* build/tpl */

  function addMapDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('mapDeep', getMapDeep(_), !getMapDeep.notChainable);
  }

  function getPathMatches(_) {
    var pathToString = getPathToString(_);
    function pathMatches(path, paths) {
      var pathString;
      var pathArray;
      if (_.isString(path)) {
        pathString = path;
      } else {
        pathArray = path;
      }
      if (!_.isArray(paths)) {
        paths = [paths];
      } else {
        paths = _.cloneDeep(paths);
      }
      for (var i = 0; i < paths.length; i++) {
        if (_.isString(paths[i])) {
          paths[i] = _.toPath(paths[i]);
        }
        if (_.isArray(paths[i])) {
          if (pathArray === undefined) {
            pathArray = _.toPath(pathString);
          }
          if (
            pathArray.length >= paths[i].length &&
            _.isEqual(_.takeRight(pathArray, paths[i].length), paths[i])
          ) {
            // console.log('path matched');
            return paths[i];
          }
        } else if (paths[i] instanceof RegExp) {
          if (pathString === undefined) {
            pathString = pathToString(path);
          }
          if (paths[i].test(pathString)) {
            // console.log('regex matched', paths[i]);
            return paths[i];
          }
        } else {
          throw new Error(
            'To match path use only string/regex or array of them.'
          );
        }
      }
      // console.log('matched nothing');
      return false;
    }
    return pathMatches;
  }

  getPathMatches.notChainable = true;

  function getOmitDeep(_) {
    var pathMatches = getPathMatches(_);
    var filterDeep = getFilterDeep(_);

    function omitDeep(obj, paths, options) {
      options = _.merge(
        {
          invert: false,
        },
        options || {}
      );
      var isOmit = !options.invert;
      options = _.merge(
        {
          onMatch: {
            cloneDeep: false,
            skipChildren: false,
            keepIfEmpty: !isOmit,
          },
          onNotMatch: {
            cloneDeep: false,
            skipChildren: false,
            keepIfEmpty: isOmit,
          },
        },
        options
      );
      options.leavesOnly = false;
      options.childrenPath = undefined;
      options.includeRoot = undefined;
      options.pathFormat = 'array';
      options.onTrue = options.invert ? options.onMatch : options.onNotMatch;
      options.onFalse = options.invert ? options.onNotMatch : options.onMatch;

      var test = function(value, key, parent, context) {
        if (pathMatches(context.path, paths) !== false) {
          return options.invert;
        } else {
          return !options.invert;
        }
      };
      return filterDeep(obj, test, options);
    }
    return omitDeep;
  }

  /* build/tpl */

  function addOmitDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('omitDeep', getOmitDeep(_), !getOmitDeep.notChainable);
  }

  /* build/tpl */

  function addPathMatches(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('pathMatches', getPathMatches(_), !getPathMatches.notChainable);
  }

  /* build/tpl */

  function addPathToString(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('pathToString', getPathToString(_), !getPathToString.notChainable);
  }

  /* build/tpl */

  function addPaths(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('paths', getPaths(_), !getPaths.notChainable);
  }

  function getPickDeep(_) {
    var omitDeep = getOmitDeep(_);
    function pickDeep(obj, paths, options) {
      options = _.merge(
        {
          invert: false,
        },
        options || {}
      );
      options.invert = true;
      return omitDeep(obj, paths, options);
    }
    return pickDeep;
  }

  /* build/tpl */

  function addPickDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('pickDeep', getPickDeep(_), !getPickDeep.notChainable);
  }

  function getReduceDeep(_) {
    var eachDeep = getEachDeep(_);

    function reduceDeep(obj, iteratee, accumulator, options) {
      iteratee = _.iteratee(iteratee);
      var accumulatorInited = accumulator !== undefined;
      eachDeep(
        obj,
        function(value, key, parent, context) {
          delete context['break'];
          if (!accumulatorInited) {
            accumulator = value;
            accumulatorInited = true;
          } else {
            accumulator = iteratee(accumulator, value, key, parent, context);
          }
        },
        options
      );
      return accumulator;
    }
    return reduceDeep;
  }

  /* build/tpl */

  function addReduceDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('reduceDeep', getReduceDeep(_), !getReduceDeep.notChainable);
  }

  function getSomeDeep(_) {
    var findDeep = getFindDeep(_);
    function someDeep(obj, predicate, options) {
      return !!findDeep(obj, predicate, options);
    }
    return someDeep;
  }

  /* build/tpl */

  function addSomeDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('someDeep', getSomeDeep(_), !getSomeDeep.notChainable);
  }

  /* build/tpl */

  function apply(_) {
    addCondense(_);
    addCondenseDeep(_);
    addEachDeep(_);
    addExists(_);
    addFilterDeep(_);
    addFindDeep(_);
    addFindPathDeep(_);
    addFindValueDeep(_);
    addForEachDeep(_);
    addIndex(_);
    addKeysDeep(_);
    addMapDeep(_);
    addOmitDeep(_);
    addPathMatches(_);
    addPathToString(_);
    addPaths(_);
    addPickDeep(_);
    addReduceDeep(_);
    addSomeDeep(_);

    return _;
  }

  return apply;

}());
//# sourceMappingURL=deepdash.js.map
