import getMixOrPatchIn from './private/getMixOrPatchIn';
import getSomeDeep from './getSomeDeep';
//console.log('getSomeDeep',getSomeDeep.notChainable);
export default function addSomeDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('someDeep', getSomeDeep(_), !getSomeDeep.notChainable);
}
