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

  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var rxVarName$1 = /^[a-zA-Z_$]+([\w_$]*)$/;
  var rxQuot$1 = /"/g;
  var has = Object.prototype.hasOwnProperty;

  function getIterate(_) {
    var pathToString = getPathToString(_);

    function iterate(item) {
      var options = item.options;
      var obj = item.obj;
      var callback = item.callback;
      options.pathFormatArray = options.pathFormat == 'array';
      item.depth = 0;

      var broken = false;
      var breakIt = function () {
        broken = true;
        return false;
      };

      while (item) {
        if (broken) { break; }
        if (!item.inited) {
          item.inited = true;
          item.info = describeValue(item.value, options.ownPropertiesOnly);

          if (options.checkCircular) {
            item.circularParentIndex = -1;
            item.circularParent = null;
            item.isCircular = false;
            if (item.info.isObject && !item.info.isEmpty) {
              var parent = item.parent;
              while (parent) {
                if (parent.value === item.value) {
                  item.isCircular = true;
                  item.circularParent = parent;
                  item.circularParentIndex = item.depth - parent.depth - 1;
                  break;
                }
                parent = parent.parent;
              }
            }
          }

          item.children = [];
          if (options.childrenPath) {
            options.childrenPath.forEach(function (cp, i) {
              var children = _.get(item.value, cp);
              var info = describeValue(children, options.ownPropertiesOnly);
              if (!info.isEmpty) {
                item.children.push([
                  cp,
                  options.strChildrenPath[i],
                  children,
                  info ]);
              }
            });
          }

          item.isLeaf =
            item.isCircular ||
            (options.childrenPath !== undefined && !item.children.length) ||
            !item.info.isObject ||
            item.info.isEmpty;

          item.needCallback =
            (item.depth || options.includeRoot) &&
            (!options.leavesOnly || item.isLeaf);

          if (item.needCallback) {
            var contextReader = new ContextReader(obj, options, breakIt);
            contextReader.setItem(item, false);
            try {
              item.res = callback(
                item.value,
                item.key,
                item.parent && item.parent.value,
                contextReader
              );
            } catch (err) {
              if (err.message) {
                err.message +=
                  '\ncallback failed before deep iterate at:\n' +
                  pathToString(item.path);
              }

              throw err;
            }
          }

          if (broken) {
            break;
          }

          if (item.res !== false) {
            if (!broken && !item.isCircular && item.info.isObject) {
              if (
                options.childrenPath !== undefined &&
                (item.depth || !options.rootIsChildren)
              ) {
                item.childrenItems = [];
                if (item.children.length) {
                  item.children.forEach(function (ref) {
                    var cp = ref[0];
                    var scp = ref[1];
                    var children = ref[2];
                    var info = ref[3];

                    item.childrenItems = ( item.childrenItems ).concat( (info.isArray
                        ? getElements(item, children, options, cp, scp)
                        : getOwnChildren(item, children, options, cp, scp)) );
                  });
                }
              } else {
                item.childrenItems = item.info.isArray
                  ? getElements(item, item.value, options, [], '')
                  : getOwnChildren(item, item.value, options, [], '');
              }
            }
          }

          item.currentChildIndex = -1;
        }
        if (
          item.childrenItems &&
          item.currentChildIndex < item.childrenItems.length - 1
        ) {
          item.currentChildIndex++;
          item.childrenItems[item.currentChildIndex].parentItem = item;
          item = item.childrenItems[item.currentChildIndex];
          continue;
        }

        if (item.needCallback && options.callbackAfterIterate) {
          var contextReader$1 = new ContextReader(obj, options, breakIt);
          contextReader$1.setItem(item, true);

          try {
            callback(
              item.value,
              item.key,
              item.parent && item.parent.value,
              contextReader$1
            );
          } catch (err) {
            if (err.message) {
              err.message +=
                '\ncallback failed after deep iterate at:\n' +
                pathToString(item.path);
            }

            throw err;
          }
        }
        item = item.parentItem;
      }
    }

    return iterate;

    function getElements(item, children, options, childrenPath, strChildrenPath) {
      var strChildPathPrefix;
      if (!options.pathFormatArray) {
        strChildPathPrefix = item.strPath || '';

        if (
          strChildrenPath &&
          strChildPathPrefix &&
          !strChildrenPath.startsWith('[')
        ) {
          strChildPathPrefix += '.';
        }
        strChildPathPrefix += strChildrenPath || '';
      }
      var res = [];
      for (var i = 0; i < children.length; i++) {
        var val = children[i];
        if (val === undefined && !(i in children)) {
          continue;
        }
        var strChildPath = (void 0);
        var pathFormatString = !options.pathFormatArray;
        if (pathFormatString) {
          strChildPath = strChildPathPrefix + "[" + i + "]";
        }
        res.push({
          value: val,
          key: i + '',
          path: (item.path || []).concat( childrenPath, [i + '']),
          strPath: strChildPath,
          depth: item.depth + 1,
          parent: {
            value: item.value,
            key: item.key,
            path: pathFormatString ? item.strPath : item.path,
            parent: item.parent,
            depth: item.depth,
            info: item.info,
          },
          childrenPath: (childrenPath.length && childrenPath) || undefined,
          strChildrenPath: strChildrenPath || undefined,
        });
      }
      return res;
    }

    function getOwnChildren(
      item,
      children,
      options,
      childrenPath,
      strChildrenPath
    ) {
      var strChildPathPrefix;
      if (!options.pathFormatArray) {
        strChildPathPrefix = item.strPath || '';

        if (
          strChildrenPath &&
          strChildPathPrefix &&
          !strChildrenPath.startsWith('[')
        ) {
          strChildPathPrefix += '.';
        }
        strChildPathPrefix += strChildrenPath || '';
      }
      var res = [];
      var pathFormatString = !options.pathFormatArray;
      for (var childKey in children) {
        if (options.ownPropertiesOnly && !has.call(children, childKey)) {
          continue;
        }

        var strChildPath = (void 0);
        if (pathFormatString) {
          if (rxVarName$1.test(childKey)) {
            if (strChildPathPrefix) {
              strChildPath = strChildPathPrefix + "." + childKey;
            } else {
              strChildPath = "" + childKey;
            }
          } else {
            strChildPath = strChildPathPrefix + "[\"" + (childKey.replace(
              rxQuot$1,
              '\\"'
            )) + "\"]";
          }
        }

        res.push({
          value: children[childKey],
          key: childKey,
          path: (item.path || []).concat( childrenPath, [childKey]),
          strPath: strChildPath,
          depth: item.depth + 1,
          parent: {
            value: item.value,
            key: item.key,
            path: pathFormatString ? item.strPath : item.path,
            parent: item.parent,
            depth: item.depth,
            info: item.info,
          },
          childrenPath: (childrenPath.length && childrenPath) || undefined,
          strChildrenPath: strChildrenPath || undefined,
        });
      }

      return res;
    }
  }

  var ContextReader = function ContextReader(obj, options, breakIt) {
    this.obj = obj;
    this._options = options;
    this['break'] = breakIt;
  };

  var prototypeAccessors = { path: { configurable: true },parent: { configurable: true },parents: { configurable: true },depth: { configurable: true },isLeaf: { configurable: true },isCircular: { configurable: true },circularParentIndex: { configurable: true },circularParent: { configurable: true },childrenPath: { configurable: true },info: { configurable: true } };
  ContextReader.prototype.setItem = function setItem (item, afterIterate) {
    this._item = item;
    this.afterIterate = afterIterate;
  };
  prototypeAccessors.path.get = function () {
    return this._options.pathFormatArray ? this._item.path : this._item.strPath;
  };

  prototypeAccessors.parent.get = function () {
    return this._item.parent;
  };

  prototypeAccessors.parents.get = function () {
    if (!this._item._parents) {
      this._item._parents = [];
      var curParent = this._item.parent;
      while (curParent) {
        this._item._parents[curParent.depth] = curParent;
        curParent = curParent.parent;
      }
    }
    return this._item._parents;
  };
  prototypeAccessors.depth.get = function () {
    return this._item.depth;
  };

  prototypeAccessors.isLeaf.get = function () {
    return this._item.isLeaf;
  };

  prototypeAccessors.isCircular.get = function () {
    return this._item.isCircular;
  };

  prototypeAccessors.circularParentIndex.get = function () {
    return this._item.circularParentIndex;
  };

  prototypeAccessors.circularParent.get = function () {
    return this._item.circularParent;
  };

  prototypeAccessors.childrenPath.get = function () {
    return (
      (this._options.childrenPath !== undefined &&
        (this._options.pathFormatArray
          ? this._item.childrenPath
          : this._item.strChildrenPath)) ||
      undefined
    );
  };

  prototypeAccessors.info.get = function () {
    return this._item.info;
  };

  Object.defineProperties( ContextReader.prototype, prototypeAccessors );

  function isObjectEmpty(value, ownPropertiesOnly) {
    for (var key in value) {
      if (!ownPropertiesOnly || has.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  function describeValue(value, ownPropertiesOnly) {
    var res = { isObject: isObject(value) };
    res.isArray = res.isObject && Array.isArray(value);
    res.isEmpty = res.isArray
      ? !value.length
      : res.isObject
      ? isObjectEmpty(value, ownPropertiesOnly)
      : true;

    return res;
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
          ownPropertiesOnly: true, //
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
        ownPropertiesOnly: options.ownPropertiesOnly,
      };
      var arrays = [];
      //console.log('condenseDeep → eachDeep');
      eachDeep(
        obj,
        function (value, key, parent, context) {
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
        function (value, key, parent, context) {
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
        function (value, key, parent, context) {
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
      var skipChildren;

      eachDeep(
        obj,
        function (value, key, parent, context) {
          // if (!context.skipChildren) {
          context.skipChildren = function (skip) {
            skipChildren = skip;
          };
          // }
          skipChildren = undefined;
          var r = iteratee(value, key, parent, context);
          if (!context.isLeaf && skipChildren === undefined) {
            skipChildren =
              value !== r && Array.isArray(value) != Array.isArray(r);
          }
          if (context.path !== undefined) {
            _.set(res, context.path, r);
          } else {
            res = r;
          }
          if (skipChildren) {
            return false;
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

      var test = function (value, key, parent, context) {
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
