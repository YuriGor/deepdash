import each from 'lodash-es/each';
import filterDeep from '../../../dist/esm/filterDeep';

var obj = { a: true, b: false };
each(obj, (v) => console.log(v));
console.log(filterDeep(obj));
