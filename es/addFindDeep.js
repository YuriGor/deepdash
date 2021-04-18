/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getFindDeep from './getFindDeep.js';

export default function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findDeep', getFindDeep(_), !getFindDeep.notChainable);
}
