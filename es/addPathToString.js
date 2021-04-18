/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getPathToString from './getPathToString.js';

export default function addPathToString(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathToString', getPathToString(_), !getPathToString.notChainable);
}
