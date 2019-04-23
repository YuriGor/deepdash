import _merge from 'lodash-es/merge';
import { b as filterDeepDeps, a as getFilterDeep } from './chunk-72fce61c.js';
import { a as deps$1, b as getPathMatches } from './chunk-e0ca516c.js';

var deps = _merge({ merge: _merge }, deps$1, filterDeepDeps);

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

export { getOmitDeep as a, deps as b };
