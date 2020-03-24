'use strict';

var { demo, circular, children } = require('./object')();

var { forLodashes, it, expect } = require('./common.js');
forLodashes(['paths', 'keysDeep', 'index'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.paths(obj, { leavesOnly: true });
    expect(obj);
  });
  it('Count paths', () => {
    let paths = _.paths(demo, { leavesOnly: false });
    expect(paths.length);
  });
  it('Array', () => {
    let paths = _.paths([demo, demo], { leafsOnly: false });
    expect(paths.length);
  });
  it('Count paths circular', () => {
    let paths = _.paths(circular, { checkCircular: true, leavesOnly: false });
    // console.log(paths);
    expect(paths.length);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leavesOnly: false,
    });
    // console.log(paths);
    expect(paths.length);
  });
  if (!_.v) {
    it('Chaining', () => {
      let paths = _(demo)
        .paths({ leavesOnly: false })
        .value();
      expect(paths.length);
    });
  }
  it('alias keysDeep', () => {
    let paths = _.keysDeep(demo, { leavesOnly: false });
    expect(paths.length);
  });
  it('returns empty array', () => {
    let paths = _.paths(1);
    expect(paths);
    paths = _.paths('123');
    expect(paths);
    paths = _.paths(null);
    expect(paths);
    paths = _.paths(undefined);
    expect(paths);
    paths = _.paths(() => {});
    expect(paths);
    paths = _.paths(new Date());
    expect(paths);
    paths = _.paths(/.*/);
    expect(paths);
  });

  it('Leafs only', () => {
    let paths = _.paths(demo, { leavesOnly: true });
    expect(paths.length);
  });

  it('Leafs only circular', () => {
    let paths = _.paths(circular, { checkCircular: true, leavesOnly: true });
    expect(paths.length);
    // console.log(paths);
    paths = _.paths(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leavesOnly: true,
    });
    // console.log(paths);
    expect(paths.length);
  });
  it('empty props', () => {
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    let paths = _.paths(o);
    expect(paths.length);
    var a = ['a', 'b', 'c'];
    delete a[1];
    paths = _.paths(a);
    expect(paths.length);
    var slots = ['start', , 'middle', , 'finish'];
    paths = _.paths(slots);
    expect(paths.length);
  });
  it('dangerous field names', () => {
    let obj = {
      '': '[""]',
      "'": '["\'"]',
      '"': '["\\""]',
      '[': '["["]',
      ']': '["]"]',
      '.': '["."]',
      '["."]"\'.': '["[\\".\\"]\\"\'."]',
      '["."]"\'..': {
        '["."]"\'.': '["[\\".\\"]\\"\'.."]["[\\".\\"]\\"\'."]',
      },
      '["."]"\'...': [
        {
          '["."]"\'.': '["[\\".\\"]\\"\'..."][0]["[\\".\\"]\\"\'."]',
        },
      ],
    };
    _.each(_.index(obj), (v, k) => {
      expect(k);
      expect(_.get(obj, k));
    });
  });
  it('array paths format', () => {
    var paths = _.paths(demo, { pathFormat: 'array' });
    expect(paths);
  });

  it('No leavesOnly in tree', () => {
    try {
      _.paths(children, { childrenPath: 'children', leavesOnly: true });
    } catch (exc) {
      expect(exc.message);
    }
  });
  it('paths of tree', () => {
    let paths = _.paths(children, { childrenPath: 'children' });

    // console.log(paths);
    expect(paths);
  });
});
