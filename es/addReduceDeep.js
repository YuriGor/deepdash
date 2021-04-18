/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getReduceDeep from './getReduceDeep.js';

export default function addReduceDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('reduceDeep', getReduceDeep(_), !getReduceDeep.notChainable);
}
