import { a as getMixOrPatchIn } from './chunk-a317d93b.js';
import './getPathToString.js';
import getPathMatches from './getPathMatches.js';

function addPathMatches(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), false);
}

export default addPathMatches;
