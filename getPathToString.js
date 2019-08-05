'use strict';

var rxArrIndex = /^\d+$/;
var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;

function getPathToString(_) {
  function pathToString(path) {
    if (_.isString(path)) { return path; }
    if (!_.isArray(path)) { return undefined; }
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
  return pathToString;
}

module.exports = getPathToString;
