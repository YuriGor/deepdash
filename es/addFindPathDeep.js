/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindPathDeep from './getFindPathDeep';

export default function addFindPathDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findPathDeep', getFindPathDeep(_), !getFindPathDeep.notChainable);
}
