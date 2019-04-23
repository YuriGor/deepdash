var deps = {};

function getCondense(_) {
  function condense(arr) {
    var indexes = [];
    for (var i = 0; i < arr.length; i++) {
      if (!(i in arr)) {
        indexes.push(i);
      }
    }
    var length = indexes.length,
      lastIndex = length - 1;

    while (length--) {
      var index = indexes[length];
      if (length == lastIndex || index !== previous) {
        var previous = index;
        arr.splice(index, 1);
      }
    }
    return arr;
  }
  return condense;
}

export { getCondense as a, deps as b };
