import getMixOrPatchIn from './private/getMixOrPatchIn';
import getEachDeep from './getEachDeep';

export default function addForEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getEachDeep(_));
}
