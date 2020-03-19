/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFilterDeep from './getFilterDeep';

export default function addFilterDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('filterDeep', getFilterDeep(_), !getFilterDeep.notChainable);
}
