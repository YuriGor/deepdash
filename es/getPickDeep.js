import getOmitDeep from './getOmitDeep.js';

export default function getPickDeep(_) {
  var omitDeep = getOmitDeep(_);
  function pickDeep(obj, paths, options) {
    options = _.merge(
      {
        invert: false,
      },
      options || {}
    );
    options.invert = true;
    return omitDeep(obj, paths, options);
  }
  return pickDeep;
}
