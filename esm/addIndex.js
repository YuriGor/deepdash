import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import './getPathToString.js';
import './getEachDeep.js';
import getIndex from './getIndex.js';

function addIndex(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('index', getIndex(_));
}

export default addIndex;
