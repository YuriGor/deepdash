const lodash = require('lodash').runInContext();

let standalone = require('../standalone');
// if (standalone.eachDeep) {
//   console.log('standalone has eachDeep!!!');
// } else {
//   console.log('standalone has NO eachDeep!!!');
// }

standalone = lodash.merge({}, lodash.runInContext(), standalone);
standalone.v = 'standalone';

module.exports = {
  forLodashes: (methods, test, title) => {
    const lodashes = [standalone];
    // console.log('standalone:', standalone.filterDeep);

    lodashes.forEach(function(dd) {
      let c = 1000;
      while (c--) {
        test(dd);
      }
    });
  },
  validateIteration: function() {},
  it: (label, cb) => cb(),
  expect: () => {},
};
