/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getSomeDeep from './getSomeDeep';

export default function addSomeDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('someDeep', getSomeDeep(_), !getSomeDeep.notChainable);
}
