import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import './getCondense.js';
import './getPathToString.js';
import './getEachDeep.js';
import getCondenseDeep from './getCondenseDeep.js';

function addCondenseDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condenseDeep', getCondenseDeep(_));
}

export default addCondenseDeep;
