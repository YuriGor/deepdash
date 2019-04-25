import getMixOrPatchIn from './private/getMixOrPatchIn';
import getReduceDeep from './getReduceDeep';

export default function addCondense(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('reduceDeep', getReduceDeep(_));
}
