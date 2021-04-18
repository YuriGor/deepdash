/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getOmitDeep from './getOmitDeep.js';

export default function addOmitDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_), !getOmitDeep.notChainable);
}
