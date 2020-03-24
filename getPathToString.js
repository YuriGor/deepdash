'use strict';

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

module.exports = getPathToString;
