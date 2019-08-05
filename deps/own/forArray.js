'use strict';

function forArray(arr, iteratee) {
  for (var i = 0; i < arr.length; i++) {
    if (iteratee(arr[i], i, arr) === false) { break; }
  }
  return arr;
}

module.exports = forArray;
