function getExists(_) {
  function exists(obj, path) {
    path = _.isArray(path) ? _.clone(path) : _.toPath(path);
    var key = path.pop();
    var parent = path.length ? _.get(obj, path) : obj;
    return parent !== undefined && key in parent;
  }
  return exists;
}

export default getExists;
