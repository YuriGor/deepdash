/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getCondense from './getCondense';

export default function addCondense(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condense', getCondense(_), !getCondense.notChainable);
}
