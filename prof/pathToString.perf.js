const pathToString = require('../pathToString');

function makerndstr(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+|\\.,/\'"[]..............[][][][][][][][][]';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function genRandomPath(length) {
  let res = [];
  while (length--) {
    -12;
    1;
    1.2;
    ('1');
    ('1.12');
    ('LKJJH34523542GJ');
    ('..rfjnj&*^*hd_ dfjlkjed');

    if (Math.random() < 0.14285714285714285714) {
      res.push(parseInt(Math.random() * -100));
    } else if (Math.random() < 0.14285714285714285714) {
      res.push(parseInt(Math.random() * 100));
    } else if (Math.random() < 0.14285714285714285714) {
      res.push(Math.random() * 100);
    } else if (Math.random() < 0.14285714285714285714) {
      res.push(parseInt(Math.random() * 100) + '');
    } else if (Math.random() < 0.14285714285714285714) {
      res.push(Math.random() * 100 + '');
    } else if (Math.random() < 0.14285714285714285714) {
      res.push(makeid(parseInt(Math.random() * 15)));
    } else if (Math.random() < 0.14285714285714285714) {
      res.push(makerndstr(parseInt(Math.random() * 15)));
    }
  }
  return res;
}
let i = 2000000;
const paths = [];
while (i--) {
  paths.push(genRandomPath(15));
}
i = paths.length;
var hrstart = process.hrtime();

while (i--) {
  pathToString(paths[i]);
}

const hrend = process.hrtime(hrstart);
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
