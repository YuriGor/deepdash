/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getPathToString from './getPathToString';

export default function addPathToString(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathToString', getPathToString(_), !getPathToString.notChainable);
}
