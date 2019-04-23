import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import './getPathToString.js';
import getEachDeep from './getEachDeep.js';

function addForEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getEachDeep(_));
}

export default addForEachDeep;
