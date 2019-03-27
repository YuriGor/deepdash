'use strict';
(function() {
  function apply(_) {
    var rxArrIndex = /^\d+$/;
    var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
    var errorNoLeavesOnlyAndTree =
      '"leavesOnly" option cannot be true in the "tree" mode.';
    function pathToString(path) {
      if (_.isString(path)) return path;
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
    if (!_.pathToString) {
      _.mixin({ pathToString: pathToString }, { chain: false });
    }
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
    if (!_.pathMatches) {
      _.mixin({ pathMatches: pathMatches }, { chain: false });
    }
    function iterate(
      value,
      callback,
      options,
      key,
      path,
      depth,
      parent,
      parents,
      obj
    ) {
      if (!_.isObject(value)) return;
      if (key === undefined) key = '';
      if (path === undefined) path = [];
      if (depth === undefined) depth = 0;
      if (parents === undefined) parents = [];
      if (obj === undefined) obj = value;
      if (options.pathFormat === undefined) options.pathFormat = 'string';
      if (options.checkCircular === undefined) options.checkCircular = false;
      var currentObj = {
        value: value,
        key: key,
        path: options.pathFormat == 'array' ? path : pathToString(path),
        parent: parent,
        isTreeNode: parent && parent.isTreeChildren,
      };
      // console.log('it', currentObj.path);
      var currentParents = parents.concat(currentObj);
      if (options.tree) {
        if (!_.isObject(options.tree)) {
          options.tree = {};
        }
        if (options.tree.rootIsChildren === undefined) {
          options.tree.rootIsChildren = true;
        }
        if (!options.tree.children) {
          options.tree.children = ['children'];
        }
        if (!depth && options.tree.rootIsChildren) {
          currentObj.isTreeChildren = true;
          currentObj.treeChildrenPath =
            options.pathFormat == 'string' ? '' : [];
        } else {
          var matches = pathMatches(path, options.tree.children);
          if (matches !== false) {
            currentObj.isTreeChildren = true;
            currentObj.treeChildrenPath =
              options.pathFormat == 'array' || !_.isArray(matches)
                ? matches
                : pathToString(matches);
          } else {
            currentObj.isTreeChildren = false;
          }
        }
      }
      _.forOwn(value, function(childValue, childKey) {
        if (_.isArray(value)) {
          if (childValue === undefined && !(childKey in value)) {
            return; //empty slot
          }
        }

        var childPath = path.concat([childKey]);
        var isCircular = undefined;
        var circularParentIndex = undefined;
        var circularParent = undefined;
        if (options.checkCircular) {
          if (_.isObject(childValue) && !_.isEmpty(childValue)) {
            circularParentIndex = _.findIndex(currentParents, function(v) {
              return v.value === childValue;
            });
            circularParent = currentParents[circularParentIndex];
          } else {
            circularParentIndex = -1;
            circularParent = null;
          }
          isCircular = circularParentIndex !== -1;
          if (isCircular) {
            //console.log('cr: ', pathToString(childPath));
          }
          if (options.tree) {
            // console.log(
            //   (isCircular ? 'IS' : 'NOT') + ' circular: ' + childPath
            // );
          }
        }
        var res;
        var context = {
          path:
            options.pathFormat == 'array' ? childPath : pathToString(childPath),
          parent: currentObj,
          parents: currentParents,
          obj: obj,
          depth: depth,
          isCircular: isCircular,
          circularParent: circularParent,
          circularParentIndex: circularParentIndex,
        };
        if (!options.tree || currentObj.isTreeChildren) {
          res = callback(childValue, childKey, value, context);
          // console.log('cb', context.path, currentObj.isTreeChildren);
        } else {
          // console.log('no cb', context.path, currentObj.isTreeChildren);
        }
        if (res !== false && !isCircular && _.isObject(value)) {
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
        }
        if (
          options.callbackAfterIterate &&
          (!options.tree || currentObj.isTreeChildren)
        ) {
          context.afterIterate = true;
          callback(childValue, childKey, value, context);
        }
      });
    }

    if (!_.eachDeep || !_.forEachDeep) {
      var eachDeep = function(obj, callback, options) {
        if (callback === undefined) callback = _.identity;
        options = _.merge({}, options || {});
        iterate(obj, callback, options);
        return obj;
      };
      if (!_.eachDeep) {
        _.mixin({ eachDeep: eachDeep });
      }
      if (!_.forEachDeep) {
        _.mixin({ forEachDeep: eachDeep });
      }
    }
    var indexate = function(obj, options) {
      if (options && options.leafsOnly !== undefined) {
        options.leavesOnly = options.leafsOnly;
      }

      options = _.merge(
        {
          checkCircular: false,
          includeCircularPath: true,
          leavesOnly: !options || !options.tree,
        },
        options || {}
      );
      if (options.tree && options.leavesOnly) {
        throw new Error(errorNoLeavesOnlyAndTree);
      }
      var eachDeepOptions = {
        pathFormat: 'string',
        checkCircular: options.checkCircular,
        tree: options.tree,
      };
      var res = {};
      _.eachDeep(
        obj,
        function(value, key, parent, context) {
          if (!context.isCircular || options.includeCircularPath) {
            if (
              !options.tree &&
              options.leavesOnly &&
              res[context.parent.path]
            ) {
              delete res[context.parent.path];
            }
            res[context.path] = value;
          }
        },
        eachDeepOptions
      );
      return res;
    };
    if (!_.index) {
      _.mixin({ index: indexate });
    }
    if (!_.indexate) {
      _.mixin({ indexate: indexate });
    }
    if (!_.keysDeep || !_.paths) {
      var paths = function(obj, options) {
        if (options && options.leafsOnly !== undefined) {
          options.leavesOnly = options.leafsOnly;
        }
        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leavesOnly: !options || !options.tree,
            pathFormat: 'string',
          },
          options || {}
        );
        if (options.tree && options.leavesOnly) {
          throw new Error(errorNoLeavesOnlyAndTree);
        }
        var eachDeepOptions = {
          pathFormat: options.pathFormat,
          checkCircular: options.checkCircular,
          tree: options.tree,
        };
        var res = [];
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            if (!context.isCircular || options.includeCircularPath) {
              if (
                !options.tree &&
                options.leavesOnly &&
                _.last(res) === context.parent.path
              ) {
                res.pop();
              }
              res.push(context.path);
            }
          },
          eachDeepOptions
        );
        return res;
      };
      if (!_.keysDeep) {
        _.mixin({ keysDeep: paths });
      }
      if (!_.paths) {
        _.mixin({ paths: paths });
      }
    }
    if (!_.exists) {
      _.mixin(
        {
          exists: function(obj, path) {
            path = _.isArray(path) ? _.clone(path) : _.toPath(path);
            var key = path.pop();
            var parent = path.length ? _.get(obj, path) : obj;
            return parent !== undefined && key in parent;
          },
        },
        { chain: false }
      );
    }
    if (!_.condense) {
      _.mixin({
        condense: function(arr) {
          _.remove(arr, function(val, key, coll) {
            return !(key in coll);
          });
          return arr;
        },
      });
    }
    if (!_.condenseDeep) {
      var condenseDeep = function(obj, options) {
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
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            if (!context.isCircular && _.isArray(value)) arrays.push(value);
          },
          eachDeepOptions
        );
        if (_.isArray(obj)) arrays.push(obj);
        _.each(arrays, _.condense);
        return obj;
      };
      _.mixin({
        condenseDeep: condenseDeep,
      });
    }
    if (!_.filterDeep) {
      var filterDeep = function(obj, predicate, options) {
        predicate = _.iteratee(predicate);
        if (options && options.leafsOnly !== undefined) {
          options.leavesOnly = options.leafsOnly;
        }
        if (!options) {
          options = {};
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
        if (options.tree) {
          if (options.leavesOnly) {
            throw new Error(errorNoLeavesOnlyAndTree);
          }
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
            leavesOnly: true,
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
          tree: options.tree,
          callbackAfterIterate: true,
        };
        var res = _.isArray(obj) ? [] : {};
        var replies = {};
        var foundCircular = [];
        //console.log('filterDeep → eachDeep');
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            var curPath = pathToString(context.path);
            if (!context.afterIterate) {
              if (!context.isCircular) {
                // console.log('fr: ', context.path);
                var reply;
                if (
                  !options.leavesOnly ||
                  (context.parent && context.parent.isTreeChildren) ||
                  !_.isObject(value) ||
                  _.isEmpty(value)
                ) {
                  reply = predicate(value, key, parent, context);
                  // console.log('?', reply);
                }
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
                replies[curPath] = reply;
                // console.log('→', replies);
                if (reply.keepIfEmpty || !reply.skipChildren) {
                  if (options.cloneDeep && reply.cloneDeep) {
                    _.set(res, context.path, options.cloneDeep(value));
                  } else {
                    _.set(
                      res,
                      context.path,
                      _.isArray(value)
                        ? []
                        : _.isPlainObject(value)
                        ? {}
                        : value
                    );
                  }
                }
                return !reply.skipChildren;
              } else {
                // console.log('fc: ', context.path);
                _.unset(res, context.path);
                if (options.keepCircular) {
                  foundCircular.push([
                    context.path,
                    context.circularParent.path,
                  ]);
                }
                return false;
              }
            } else if (context.afterIterate && !context.isCircular) {
              // console.log('ai: ', context.path);
              if (replies[curPath].empty && !replies[curPath].keepIfEmpty) {
                _.unset(res, context.path);
              } else {
                var p = !options.tree
                  ? context.parent
                  : _.findLast(context.parents, 'isTreeNode');
                if (p) {
                  p = pathToString(p.path);
                  if (p) {
                    // if (!replies[p])
                    //   console.log('no reply for "' + p + '"', p);
                    replies[p].empty = false;
                  }
                }
              }
              delete replies[curPath];

              // console.log('←', replies);
              return;
            } else {
              // console.log('aic: ', context.path);
            }
          },
          eachDeepOptions
        );
        _.each(foundCircular, function(c) {
          var cv;
          var exists = c[1] == '' || _.exists(res, c[1]);
          if (!exists) return;
          // console.log('circular: ', c[0], c[1]);
          if (_.has(options, 'replaceCircularBy')) {
            cv = options.replaceCircularBy;
          } else if (c[1] == '') {
            cv = res;
          } else {
            cv = _.get(res, c[1]);
          }
          _.set(res, c[0], cv);
        });
        if (options.condense) {
          //console.log('filterDeep → condenseDeep');
          return _.condenseDeep(res, { checkCircular: options.checkCircular });
        }
        return res;
      };

      _.mixin({ filterDeep: filterDeep });
    }

    if (!_.omitDeep) {
      var omitDeep = function(obj, paths, options) {
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
        options.tree = false;
        options.pathFormat = 'array';
        options.onTrue = options.invert ? options.onMatch : options.onNotMatch;
        options.onFalse = options.invert ? options.onNotMatch : options.onMatch;

        var test = function(value, key, parent, context) {
          if (pathMatches(context.path, paths) !== false) {
            // console.log('path match, return ', options.invert);
            return options.invert;
          } else {
            // console.log('path not match, return ', !options.invert);
            return !options.invert;
          }
        };
        // console.log(options);
        return _.filterDeep(obj, test, options);
      };
      _.mixin({ omitDeep: omitDeep });
    }

    if (!_.pickDeep) {
      var pickDeep = function(obj, paths, options) {
        options = _.merge(
          {
            invert: false,
          },
          options || {}
        );
        options.invert = true;
        return _.omitDeep(obj, paths, options);
      };
      _.mixin({ pickDeep: pickDeep });
    }

    return _;
  }

  if (
    typeof module !== 'undefined' &&
    typeof module.exports !== 'undefined' &&
    !process.env.likebrowser
  ) {
    module.exports = apply;
  } else {
    if (typeof _ !== 'undefined') {
      apply(_);
    } else throw new Error('No lodash to mixin');
  }
})();
