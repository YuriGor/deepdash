/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getCondense from './getCondense.js';

export default function addCondense(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condense', getCondense(_), !getCondense.notChainable);
}
