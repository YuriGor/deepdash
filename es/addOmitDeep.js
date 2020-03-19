/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getOmitDeep from './getOmitDeep';

export default function addOmitDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_), !getOmitDeep.notChainable);
}
