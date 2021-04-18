/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getFilterDeep from './getFilterDeep.js';

export default function addFilterDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('filterDeep', getFilterDeep(_), !getFilterDeep.notChainable);
}
