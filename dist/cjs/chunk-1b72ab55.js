'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var __chunk_8 = require('./chunk-0ec17586.js');
var __chunk_9 = require('./chunk-89ab0b3e.js');

var deps = _merge({ merge: _merge }, __chunk_9.deps, __chunk_8.filterDeepDeps);

function getOmitDeep(_) {
  var pathMatches = __chunk_9.getPathMatches(_);
  var filterDeep = __chunk_8.getFilterDeep(_);

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
    return filterDeep(obj, test, options);
  }
  return omitDeep;
}

exports.getOmitDeep = getOmitDeep;
exports.omitDeepDeps = deps;
