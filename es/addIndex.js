/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getIndex from './getIndex.js';

export default function addIndex(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('index', getIndex(_), !getIndex.notChainable);
}
