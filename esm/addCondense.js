import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import getCondense from './getCondense.js';

function addCondense(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condense', getCondense(_));
}

export default addCondense;
