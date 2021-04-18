'use strict';

var getFilterDeep = require('./getFilterDeep.js');
var getPathMatches = require('./getPathMatches.js');

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

module.exports = getOmitDeep;
