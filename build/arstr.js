module.exports = function(str, cb) {
  str = str.split('');
  str = cb(str) || str;
  return str.join('');
};

module.exports.upFirst = (str) =>
  module.exports(str, (arr) => {
    arr[0] = arr[0].toUpperCase();
  });

module.exports.lowFirst = (str) =>
  module.exports(str, (arr) => {
    arr[0] = arr[0].toLowerCase();
  });
