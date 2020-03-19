/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getReduceDeep from './getReduceDeep';

export default function addReduceDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('reduceDeep', getReduceDeep(_), !getReduceDeep.notChainable);
}
