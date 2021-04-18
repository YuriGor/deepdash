/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getPickDeep from './getPickDeep.js';

export default function addPickDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pickDeep', getPickDeep(_), !getPickDeep.notChainable);
}
