/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getPathMatches from './getPathMatches.js';

export default function addPathMatches(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), !getPathMatches.notChainable);
}
