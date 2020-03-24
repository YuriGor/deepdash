'use strict';

var { demo, circular, children } = require('./object')();
var { forLodashes, it, expect } = require('./common.js');
forLodashes(['index'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.index(obj, { leavesOnly: true });
    expect(obj);
  });
  it('Count paths', () => {
    let index = _.index(demo, { leafsOnly: false });
    expect(_.size(index));
  });
  it('Array', () => {
    let index = _.index([demo, demo], { leavesOnly: false });
    expect(_.size(index));
  });
  it('Count paths circular', () => {
    let index = _.index(circular, {
      checkCircular: true,
      leavesOnly: false,
    });
    // console.log(index);
    expect(_.size(index));
    index = _.index(circular, {
      checkCircular: true,
      leavesOnly: false,
      includeCircularPath: false,
    });
    // console.log(index);
    expect(_.size(index));
  });
  if (!_.v) {
    it('Chaining', () => {
      let index = _(demo)
        .index({ leavesOnly: false })
        .value();
      expect(_.size(index));
    });
  }
  it('returns empty obj', () => {
    let index = _.index(1);
    expect(index);

    index = _.index('123');
    expect(index);

    index = _.index(null);
    expect(index);

    index = _.index(undefined);
    expect(index);

    index = _.index(() => {});
    expect(index);

    index = _.index(new Date());
    expect(index);

    index = _.index(/.*/);
    expect(index);
  });
  it('leavesOnly only', () => {
    let index = _.index(demo, { leavesOnly: true });
    // console.log(index);
    expect(_.size(index));
  });

  it('leavesOnly only circular', () => {
    let index = _.index(circular, { checkCircular: true, leavesOnly: true });
    expect(_.size(index));
    index = _.index(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leavesOnly: true,
    });
    expect(_.size(index));
  });
  it('empty props', () => {
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    let index = _.index(o);
    expect(_.size(index));
    var a = ['a', 'b', 'c'];
    delete a[1];
    index = _.index(a);
    expect(_.size(index));
    var slots = ['start', , 'middle', , 'finish'];
    index = _.index(slots);
    expect(_.size(index));
  });
  it('tree', () => {
    let index = _.index(children, { childrenPath: 'children' });
    let names = _.values(index);
    names = _.map(names, 'name');
    // console.log(names);
    expect(names);
  });
  it('tree leavesOnly', () => {
    let index = _.index(children, {
      childrenPath: 'children',
      leavesOnly: true,
    });
    let names = _.values(index);
    names = _.map(names, 'name');
    // console.log(names);
    expect(names);
  });
  it('not rootIsChildren', () => {
    let index = _.index(children, {
      childrenPath: 'children',
      rootIsChildren: false,
    });
    expect(index);
  });
});
