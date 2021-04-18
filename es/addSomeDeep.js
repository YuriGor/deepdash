/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getSomeDeep from './getSomeDeep.js';

export default function addSomeDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('someDeep', getSomeDeep(_), !getSomeDeep.notChainable);
}
