import getReduceDeep from './getReduceDeep.js';

export default function getMapDeep(_) {
  var reduceDeep = getReduceDeep(_);

  function mapDeep(obj, iteratee, options) {
    iteratee = _.iteratee(iteratee);
    return reduceDeep(
      obj,
      (acc, value, key, parentValue, context) => {
        acc.push(iteratee(value, key, parentValue, context));
        return acc;
      },
      [],
      options
    );
  }
  return mapDeep;
}
