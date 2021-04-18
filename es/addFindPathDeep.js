/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getFindPathDeep from './getFindPathDeep.js';

export default function addFindPathDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findPathDeep', getFindPathDeep(_), !getFindPathDeep.notChainable);
}
