/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getFindValueDeep from './getFindValueDeep.js';

export default function addFindValueDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findValueDeep', getFindValueDeep(_), !getFindValueDeep.notChainable);
}
