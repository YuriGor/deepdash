import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import getPathToString from './getPathToString.js';

function addPathToString(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathToString', getPathToString(_), false);
}

export default addPathToString;
