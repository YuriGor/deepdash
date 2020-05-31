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

  var rxArrIndex = /\D/;
  var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
  var rxQuot = /"/g;

  function joinPaths() {
    var paths = [], len = arguments.length;
    while ( len-- ) paths[ len ] = arguments[ len ];

    return paths.reduce(
      function (acc, p) { return acc ? (!p || p.startsWith('[') ? ("" + acc + p) : (acc + "." + p)) : p; },
      ''
    );
  }

  function getPathToString(_) {
    function pathToString(path) {
      var prefixes = [], len = arguments.length - 1;
      while ( len-- > 0 ) prefixes[ len ] = arguments[ len + 1 ];

      prefixes = prefixes.filter(function (p) { return p !== undefined; });
      if (_.isString(path)) { return joinPaths.apply(void 0, prefixes.concat( [path] )); }
      if (!Array.isArray(path)) { return undefined; }
      prefixes = joinPaths.apply(void 0, prefixes);
      return path.reduce(function (acc, value) {
        var type = typeof value;
        if (type === 'number') {
          if (value < 0 || value % 1 !== 0) {
            return (acc + "[\"" + value + "\"]");
          } else {
            return (acc + "[" + value + "]");
          }
        } else if (type !== 'string') {
          return (acc + "[\"" + value + "\"]");
        } else if (!value) {
          return (acc + "[\"\"]");
        }
        if (!rxArrIndex.test(value)) {
          return (acc + "[" + value + "]");
        }
        if (rxVarName.test(value)) {
          if (acc) {
            return (acc + "." + value);
          } else {
            return ("" + acc + value);
          }
        }
        return (acc + "[\"" + (value.replace(rxQuot, '\\"')) + "\"]");
      }, prefixes);
    }
    return pathToString;
  }

  getPathToString.notChainable = true;

  // if (!global.perf) {
  //   global.perf = {};
  // }
  // const perf = global.perf;

  function getIterate(_) {
    // if (!perf.iterate) {
    // perf.iterate = {
    //     currentObj: 0,
    //     currentObj_c: 0,
    //     checkCircular: 0,
    //     checkCircular_c: 0,
    //     children: 0,
    //     children_c: 0,
    //     isLeaf: 0,
    //     isLeaf_c: 0,
    //     needCallback: 0,
    //     needCallback_c: 0,
    //     currentParents: 0,
    //     currentParents_c: 0,
    //     context: 0,
    //     context_c: 0,
    //     invokeCallback: 0,
    //     invokeCallback_c: 0,
    //     addOwnChildren: 0,
    //     addOwnChildren_c: 0,
    //     push: 0,
    //     push_c: 0,
    //   };
    // perf.invokeCallback = {
    //     before: 0,
    //     before_c: 0,
    //   };
    // perf.addOwnChildren = {
    //     emptySlot: 0,
    //     emptySlot_c: 0,
    //     childPath: 0,
    //     childPath_c: 0,
    //     strChildPath: 0,
    //     strChildPath_c: 0,
    //     push: 0,
    //     push_c: 0,
    //   };
    // }
    var pathToString = getPathToString(_);

    function iterate(item) {
      var options = item.options;
      var obj = item.obj;
      var callback = item.callback;
      options.pathFormatArray = options.pathFormat == 'array';
      if (options.pathFormatArray) {
        item.strPath = pathToString(item.path);
      }
      item.depth = 0;
      item.parents = [];

      var broken = false;
      var breakIt = function () {
        broken = true;
        return false;
      };

      // let start;
      while (item) {
        if (broken) { break; }
        if (!item.inited) {
          // start = Date.now();
          item.inited = true;
          var itemIsObject = _.isObject(item.value);
          var itemIsEmpty = _.isEmpty(item.value);

          item.currentObj = {
            value: item.value,
            key: item.key,
            path: options.pathFormatArray ? item.path : item.strPath,
            parent: item.parent,
          };
          // perf.iterate.currentObj += Date.now() - start;
          // perf.iterate.currentObj_c++;
          // start = Date.now();
          if (options.checkCircular) {
            item.circularParentIndex = -1;
            item.circularParent = null;
            item.isCircular = false;
            if (itemIsObject && !itemIsEmpty) {
              var i = item.parents.length;
              while (i--) {
                if (item.parents[i].value === item.value) {
                  item.circularParentIndex = i;
                  item.circularParent = item.parents[i];
                  item.isCircular = true;
                  break;
                }
              }
            }
          }
          // perf.iterate.checkCircular += Date.now() - start;
          // perf.iterate.checkCircular_c++;
          // start = Date.now();
          item.children = [];
          if (options.childrenPath) {
            options.childrenPath.forEach(function (cp, i) {
              var children = _.get(item.value, cp);
              if (!_.isEmpty(children)) {
                item.children.push([cp, options.strChildrenPath[i], children]);
              }
            });
          }
          // perf.iterate.children += Date.now() - start;
          // perf.iterate.children_c++;
          // start = Date.now();
          item.isLeaf =
            item.isCircular ||
            (options.childrenPath !== undefined && !item.children.length) ||
            !itemIsObject ||
            itemIsEmpty;

          // perf.iterate.isLeaf += Date.now() - start;
          // perf.iterate.isLeaf_c++;
          // start = Date.now();
          item.needCallback =
            (item.depth || options.includeRoot) &&
            (!options.leavesOnly || item.isLeaf);

          // perf.iterate.needCallback += Date.now() - start;
          // perf.iterate.needCallback_c++;
          // start = Date.now();

          item.currentParents = ( item.parents ).concat( [item.currentObj]);

          // perf.iterate.currentParents += Date.now() - start;
          // perf.iterate.currentParents_c++;
          // start = Date.now();

          if (item.needCallback) {
            item.context = {
              path: item.currentObj.path,
              parent: item.parent,
              parents: item.parents,
              obj: obj,
              depth: item.depth,
              isLeaf: item.isLeaf,
              isCircular: item.isCircular,
              circularParentIndex: item.circularParentIndex,
              circularParent: item.circularParent,
              "break": breakIt,
            };

            if (options.childrenPath !== undefined) {
              item.context.childrenPath = options.pathFormatArray
                ? item.childrenPath
                : item.strChildrenPath;
            }
          }

          // perf.iterate.context += Date.now() - start;
          // perf.iterate.context_c++;
          // start = Date.now();

          if (item.needCallback) {
            try {
              item.res = callback(
                item.value,
                item.key,
                item.parent && item.parent.value,
                item.context
              );
            } catch (err) {
              if (err.message) {
                err.message +=
                  '\ncallback failed before deep iterate at:\n' +
                  item.context.path;
              }

              throw err;
            }
          }

          // perf.iterate.invokeCallback += Date.now() - start;
          // perf.iterate.invokeCallback_c++;
          if (broken) {
            break;
          }
          // start = Date.now();

          if (item.res !== false) {
            item.childrenItems = [];
            if (!broken && !item.isCircular && itemIsObject) {
              if (
                options.childrenPath !== undefined &&
                (item.depth || !options.rootIsChildren)
              ) {
                if (item.children.length) {
                  item.children.forEach(function (ref) {
                    var cp = ref[0];
                    var scp = ref[1];
                    var children = ref[2];

                    if (_.isObject(children)) {
                      addOwnChildren(
                        item.childrenItems,
                        item,
                        children,
                        options,
                        cp,
                        scp
                      );
                    }
                  });
                }
              } else {
                addOwnChildren(
                  item.childrenItems,
                  item,
                  item.value,
                  options,
                  [],
                  ''
                );
              }
            }
          }

          item.currentChildIndex = -1;
          // perf.iterate.addOwnChildren += Date.now() - start;
          // perf.iterate.addOwnChildren_c++;
        }
        // start = Date.now();
        if (
          item.childrenItems &&
          item.currentChildIndex < item.childrenItems.length - 1
        ) {
          item.currentChildIndex++;
          item.childrenItems[item.currentChildIndex].parentItem = item;
          item = item.childrenItems[item.currentChildIndex];
          // perf.iterate.push += Date.now() - start;
          // perf.iterate.push_c++;
          continue;
        }
        // perf.iterate.push += Date.now() - start;
        // perf.iterate.push_c++;
        // start = Date.now();

        if (item.needCallback && options.callbackAfterIterate) {
          item.context.afterIterate = true;

          try {
            callback(
              item.value,
              item.key,
              item.parent && item.parent.value,
              item.context
            );
          } catch (err) {
            if (err.message) {
              err.message +=
                '\ncallback failed after deep iterate at:\n' + item.context.path;
            }

            throw err;
          }
        }
        // perf.iterate.invokeCallback += Date.now() - start;
        // perf.iterate.invokeCallback_c++;
        item = item.parentItem;
      }
    }

    return iterate;

    function addOwnChildren(
      childrenItems,
      item,
      children,
      options,
      childrenPath,
      strChildrenPath
    ) {
      var keys = Object.keys(children);
      keys.forEach(function (childKey) {
        // let start = Date.now();
        var childValue = children[childKey];
        // perf.addOwnChildren.emptySlot += Date.now() - start;
        // perf.addOwnChildren.emptySlot_c++;
        // start = Date.now();
        var childPath = (item.path || []).concat( childrenPath, [childKey]);
        // perf.addOwnChildren.childPath += Date.now() - start;
        // perf.addOwnChildren.childPath_c++;
        // start = Date.now();
        var strChildPath = options.pathFormatArray
          ? undefined
          : pathToString([childKey], item.strPath, strChildrenPath);
        // perf.addOwnChildren.strChildPath += Date.now() - start;
        // perf.addOwnChildren.strChildPath_c++;
        // start = Date.now();
        childrenItems.push({
          value: childValue,
          key: childKey,
          path: childPath,
          strPath: strChildPath,
          depth: item.depth + 1,
          parent: item.currentObj,
          parents: item.currentParents,
          childrenPath: (childrenPath.length && childrenPath) || undefined,
          strChildrenPath: strChildrenPath || undefined,
        });
        // perf.addOwnChildren.push += Date.now() - start;
        // perf.addOwnChildren.push_c++;
      });
    }
  }

  function getEachDeep(_) {
    var iterate = getIterate(_);

    function eachDeep(obj, callback, options) {
      if (callback === undefined) { callback = _.identity; }
      options = _.merge(
        {
          includeRoot: !Array.isArray(obj),
          pathFormat: 'string',
          checkCircular: false,
          leavesOnly: false,
        },
        options || {}
      );
      if (options.childrenPath !== undefined) {
        if (!options.includeRoot && options.rootIsChildren === undefined) {
          options.rootIsChildren = Array.isArray(obj);
        }
        if (
          !_.isString(options.childrenPath) &&
          !Array.isArray(options.childrenPath)
        ) {
          throw Error('childrenPath can be string or array');
        } else {
          if (_.isString(options.childrenPath)) {
            options.childrenPath = [options.childrenPath];
          }
          options.strChildrenPath = options.childrenPath;
          options.childrenPath = [];
          for (var i = options.strChildrenPath.length - 1; i >= 0; i--) {
            options.childrenPath[i] = _.toPath(options.strChildrenPath[i]);
          }
        }
      }
      iterate({
        value: obj,
        callback: callback,
        options: options,
        obj: obj,
      });
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
          if (!context.isCircular && Array.isArray(value)) { arrays.push(value); }
        },
        eachDeepOptions
      );
      if (Array.isArray(obj)) { arrays.push(obj); }
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
      path = Array.isArray(path) ? _.clone(path) : _.toPath(path);
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

      var res = Array.isArray(obj) ? [] : _.isObject(obj) ? {} : null;
      var replies = {};
      var rootReply;
      var foundCircular = [];
      // console.log('filterDeep → eachDeep', eachDeepOptions);
      eachDeep(
        obj,
        function(value, key, parent, context) {
          // delete context['break'];
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
                      Array.isArray(value)
                        ? []
                        : _.isPlainObject(value)
                        ? {}
                        : value
                    );
                  } else {
                    res = Array.isArray(value)
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
      if (Array.isArray(res) && !res.length && !eachDeepOptions.includeRoot)
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

  function getReduceDeep(_) {
    var eachDeep = getEachDeep(_);

    function reduceDeep(obj, iteratee, accumulator, options) {
      var accumulatorInited = accumulator !== undefined;
      eachDeep(
        obj,
        function(value, key, parent, context) {
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

  function getMapDeep(_) {
    var reduceDeep = getReduceDeep(_);

    function mapDeep(obj, iteratee, options) {
      iteratee = _.iteratee(iteratee);
      return reduceDeep(
        obj,
        function (acc, value, key, parentValue, context) {
          acc.push(iteratee(value, key, parentValue, context));
          return acc;
        },
        [],
        options
      );
    }
    return mapDeep;
  }

  /* build/tpl */

  function addMapDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('mapDeep', getMapDeep(_), !getMapDeep.notChainable);
  }

  function getMapKeysDeep(_) {
    var eachDeep = getEachDeep(_);
    var pathToString = getPathToString(_);
    function mapKeysDeep(obj, iteratee, options) {
      if ( options === void 0 ) options = {};

      iteratee = _.iteratee(iteratee);
      options.cloneDeep = options.cloneDeep || _.cloneDeep;
      options.callbackAfterIterate = false;
      var newPaths = [];

      eachDeep(
        obj,
        function(value, key, parent, context) {
          if (key === undefined) {
            return;
          }
          var newKey = iteratee(value, key, parent, context) + '';
          if (newKey === key) {
            return;
          }
          var oldPath = context.path;
          var oldPathStr =
            options.pathFormat === 'array' ? JSON.stringify(oldPath) : oldPath;
          var newPath =
            options.pathFormat === 'array'
              ? (context.parent.path || []).concat( (context.childrenPath || []),
                  [newKey] )
              : pathToString([newKey], context.parent.path, context.childrenPath);
          var newPathStr =
            options.pathFormat === 'array' ? JSON.stringify(newPath) : newPath;
          if (!newPaths[context.depth - 1]) {
            newPaths[context.depth - 1] = [];
          }
          newPaths[context.depth - 1].push({
            oldPath: oldPath,
            oldPathStr: oldPathStr,
            newPath: newPath,
            newPathStr: newPathStr,
          });
        },
        options
      );
      var res = options.cloneDeep(obj);

      var d = newPaths.length;
      var loop = function () {
        if (!newPaths[d]) {
          return;
        }
        var overwritten = {};
        newPaths[d].forEach(function (ref) {
          var oldPath = ref.oldPath;
          var oldPathStr = ref.oldPathStr;
          var newPath = ref.newPath;
          var newPathStr = ref.newPathStr;

          var value;
          if (Object.prototype.hasOwnProperty.call(overwritten, oldPathStr)) {
            value = overwritten[oldPathStr];
            delete overwritten[oldPathStr];
          } else {
            value = _.get(res, oldPath);
            if (value === undefined && !_.has(res, oldPath)) {
              return;
            }
            _.unset(res, oldPath);
          }
          if (
            _.has(res, newPath) &&
            !Object.prototype.hasOwnProperty.call(overwritten, newPathStr)
          ) {
            overwritten[newPathStr] = _.get(res, newPath);
          }
          _.set(res, newPath, value);
        });
      };

      while (d--) loop();
      return res;
    }
    return mapKeysDeep;
  }

  /* build/tpl */

  function addMapKeysDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('mapKeysDeep', getMapKeysDeep(_), !getMapKeysDeep.notChainable);
  }

  function getMapValuesDeep(_) {
    var eachDeep = getEachDeep(_);

    function mapValuesDeep(obj, iteratee, options) {
      iteratee = _.iteratee(iteratee);
      var res = Array.isArray(obj) ? [] : _.isObject(obj) ? {} : _.clone(obj);
      eachDeep(
        obj,
        function(value, key, parent, context) {
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
    return mapValuesDeep;
  }

  /* build/tpl */

  function addMapValuesDeep(_) {
    var mixOrPatchIn = getMixOrPatchIn(_);
    return mixOrPatchIn('mapValuesDeep', getMapValuesDeep(_), !getMapValuesDeep.notChainable);
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
      if (!Array.isArray(paths)) {
        paths = [paths];
      } else {
        paths = _.cloneDeep(paths);
      }
      for (var i = 0; i < paths.length; i++) {
        if (_.isString(paths[i])) {
          paths[i] = _.toPath(paths[i]);
        }
        if (Array.isArray(paths[i])) {
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
    addMapKeysDeep(_);
    addMapValuesDeep(_);
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
