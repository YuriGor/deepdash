import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import getExists from './getExists.js';

function addExists(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), false);
}

export default addExists;
