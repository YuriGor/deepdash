/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getExists from './getExists';

export default function addExists(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), !getExists.notChainable);
}
