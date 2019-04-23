import getMixOrPatchIn from './private/getMixOrPatchIn';
import getObtain from './getObtain';

export default function addObtain(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('obtain', getObtain(_), true);
}
