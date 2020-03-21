'use strict';

var isEmpty = require('lodash/isEmpty');

/*import isArray from './isArray';
import isObject from './isObject';

function ownIsEmpty(value) {
  if (value === undefined || value === null) {
    return true;
  }
  if (isArray(value)) {
    return !value.length;
  }
  if (isObject(value)) {
    return !Object.keys(value).length;
  }
  return true;
}
export default (value) => {
  const ldRes = isEmpty(value);
  const ownRes = ownIsEmpty(value);
  if (ldRes !== ownRes) {
    console.log({ ldRes, ownRes, value });
  }
  return ldRes;
};
*/

module.exports = isEmpty;
