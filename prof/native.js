var hrstart, hrend;

// console.log('create object literal:');
// hrstart = process.hrtime();
// for (let i = 0; i < 100000; i++) {
//   const obj = { a: 'a', b: 'b', c: '' };
// }
// hrend = process.hrtime(hrstart);
// console.log(hrend[0], hrend[1] / 1000000);

// console.log('create object and assign:');
// hrstart = process.hrtime();
// for (let i = 0; i < 100000; i++) {
//   const obj = {};
//   obj.a = 'a';
//   obj.b = 'b';
//   obj.c = 'c';
// }
// hrend = process.hrtime(hrstart);
// console.log(hrend[0], hrend[1] / 1000000);

// console.log('create null object and assign:');
// hrstart = process.hrtime();
// for (let i = 0; i < 100000; i++) {
//   const obj = Object.create(null);
//   obj.a = 'a';
//   obj.b = 'b';
//   obj.c = 'c';
// }
// hrend = process.hrtime(hrstart);
// console.log(hrend[0], hrend[1] / 1000000);

// console.log('create array literal:');
// hrstart = process.hrtime();
// for (let i = 0; i < 100000; i++) {
//   const arr = ['a', 'b', 'c'];
// }
// hrend = process.hrtime(hrstart);
// console.log(hrend[0], hrend[1] / 1000000);

// console.log('create empty array and assign:');
// hrstart = process.hrtime();
// for (let i = 0; i < 100000; i++) {
//   const arr = [];
//   arr[0] = 'a';
//   arr[1] = 'b';
//   arr[2] = 'c';
// }
// hrend = process.hrtime(hrstart);
// console.log(hrend[0], hrend[1] / 1000000);

// console.log('create sized array and assign:');
// hrstart = process.hrtime();
// for (let i = 0; i < 100000; i++) {
//   const arr = new Array(3);
//   arr[0] = 'a';
//   arr[1] = 'b';
//   arr[2] = 'c';
// }
// hrend = process.hrtime(hrstart);
// console.log(hrend[0], hrend[1] / 1000000);

console.log('----------------- arr');
const arr = [];
for (var i = 0; i < 10000000; i++) {
  arr.push(i);
}

const obj = {};
for (i = 0; i < 1000000; i++) {
  obj['x' + i] = i;
}

console.log('for array:');
hrstart = process.hrtime();
var res = [];
for (let i = 0; i < arr.length; i++) {
  const val = arr[i];
  if (val === undefined && !(i in arr)) {
    continue;
  }
  res.push(val);
}
hrend = process.hrtime(hrstart);
console.log(hrend[0], hrend[1] / 1000000);

console.log('for in array:');
hrstart = process.hrtime();
res = [];
for (let i in arr) {
  if (Object.prototype.hasOwnProperty.call(arr, i)) {
    res.push(arr[i]);
  }
}
hrend = process.hrtime(hrstart);
console.log(hrend[0], hrend[1] / 1000000);

console.log('entries array:');
hrstart = process.hrtime();
res = Object.entries(arr).map(([, v]) => {
  return v;
});
hrend = process.hrtime(hrstart);
console.log(hrend[0], hrend[1] / 1000000);

console.log('----------------- obj');

console.log('for in obj:');
hrstart = process.hrtime();
res = [];
for (var key in obj) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    res.push(obj[key]);
  }
}
hrend = process.hrtime(hrstart);
console.log(hrend[0], hrend[1] / 1000000);

console.log('entries objay:');
hrstart = process.hrtime();
res = Object.entries(obj).map(([, v]) => {
  return v;
});
hrend = process.hrtime(hrstart);
console.log(hrend[0], hrend[1] / 1000000);
