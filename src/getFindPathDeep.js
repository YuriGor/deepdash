import getFindDeep from './getFindDeep';

export default function getFindPathDeep(_) {
  const findDeep = getFindDeep(_);
  function findPathDeep(obj, predicate, options) {
    const res = findDeep(obj, predicate, options);
    return res && res.context.path;
  }
  return findPathDeep;
}
