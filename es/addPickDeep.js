import getPickDeep from './getPickDeep';
import getMixOrPatchIn from './private/getMixOrPatchIn';

export default function addPickDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pickDeep', getPickDeep(_));
}
