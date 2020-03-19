/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindValueDeep from './getFindValueDeep';

export default function addFindValueDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findValueDeep', getFindValueDeep(_), !getFindValueDeep.notChainable);
}
