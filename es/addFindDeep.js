/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindDeep from './getFindDeep';

export default function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findDeep', getFindDeep(_), !getFindDeep.notChainable);
}
