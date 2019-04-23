import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import './getPathToString.js';
import './getEachDeep.js';
import getPaths from './getPaths.js';

function addPaths(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('paths', getPaths(_));
}

export default addPaths;
