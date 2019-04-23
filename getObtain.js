'use strict';

function getObtain(_) {
  function obtain(obj, path) {
    if (path === undefined) {
      return obj;
    }
    return _.get(obj, path);
  }
  return obtain;
}

module.exports = getObtain;
