'use strict';

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

module.exports = getCondense;
