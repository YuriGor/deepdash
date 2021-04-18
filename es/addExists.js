/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getExists from './getExists.js';

export default function addExists(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), !getExists.notChainable);
}
