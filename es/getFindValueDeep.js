import getFindDeep from './getFindDeep.js';

export default function getFindValueDeep(_) {
  const findDeep = getFindDeep(_);
  function findValueDeep(obj, predicate, options) {
    const res = findDeep(obj, predicate, options);
    return res && res.value;
  }
  return findValueDeep;
}
