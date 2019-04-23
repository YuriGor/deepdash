function getMixOrPatchIn(_) {
  function mixOrPatchIn(name, method, chain) {
    if (!_[name]) {
      if (_.mixin) {
        var patch = {};
        patch[name] = method;
        if (chain === undefined) {
          chain = true;
        }
        _.mixin(patch, { chain: chain });
      } else {
        _[name] = method;
      }
    }
    return _;
  }
  return mixOrPatchIn;
}

export { getMixOrPatchIn as a };
