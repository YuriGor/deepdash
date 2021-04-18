import getFindDeep from './getFindDeep.js';

export default function getSomeDeep(_) {
  const findDeep = getFindDeep(_);
  function someDeep(obj, predicate, options) {
    return !!findDeep(obj, predicate, options);
  }
  return someDeep;
}
