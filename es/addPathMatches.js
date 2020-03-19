/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getPathMatches from './getPathMatches';

export default function addPathMatches(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), !getPathMatches.notChainable);
}
