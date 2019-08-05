'use strict';

var __chunk_3 = require('./private/getIterate.js');

function getEachDeep(_) {
  var iterate = __chunk_3.default(_);

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

module.exports = getEachDeep;
