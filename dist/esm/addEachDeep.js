import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import './getPathToString.js';
import getEachDeep from './getEachDeep.js';

function addEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_));
}

export default addEachDeep;
