import _get from 'lodash-es/get';

var deps = { get: _get };

function getObtain(_) {
  function obtain(obj, path) {
    if (path === undefined) {
      return obj;
    }
    return _.get(obj, path);
  }
  return obtain;
}

export { deps as a, getObtain as b };
