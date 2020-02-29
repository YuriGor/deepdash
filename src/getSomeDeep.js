import getFindDeep from './getFindDeep';

export default function getSomeDeep(_) {
  const findDeep = getFindDeep(_);
  function someDeep(obj, predicate, options) {
    return !!findDeep(obj, predicate, options);
  }
  return someDeep;
}
