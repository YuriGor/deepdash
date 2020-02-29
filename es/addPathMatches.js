import getMixOrPatchIn from './private/getMixOrPatchIn';
import getPathMatches from './getPathMatches';
//console.log('getPathMatches',getPathMatches.notChainable);
export default function addPathMatches(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), !getPathMatches.notChainable);
}
