'use strict';

const chai = require('chai'),
  // should = chai.should(),
  expect = chai.expect;

const asserttype = require('chai-asserttype');
chai.use(asserttype);

var { demo, circular, children } = require('./object');
var { forLodashes } = require('./common.js');
forLodashes(['index'], (_) => {
  it('no mutation', () => {
    let orig = _.cloneDeep(demo);
    let obj = _.cloneDeep(demo);
    _.index(obj, { leavesOnly: true });
    expect(obj).to.deep.equal(orig);
  });
  it('Count paths', () => {
    let index = _.index(demo, { leafsOnly: false });
    expect(_.size(index)).equal(30);
  });
  it('Array', () => {
    let index = _.index([demo, demo], { leavesOnly: false });
    expect(_.size(index)).equal(62);
  });
  it('Count paths circular', () => {
    let index = _.index(circular, {
      checkCircular: true,
      leavesOnly: false,
    });
    // console.log(index);
    expect(_.size(index)).equal(25);
    index = _.index(circular, {
      checkCircular: true,
      leavesOnly: false,
      includeCircularPath: false,
    });
    // console.log(index);
    expect(_.size(index)).equal(22);
  });
  if (!_.v) {
    it('Chaining', () => {
      let index = _(demo)
        .index({ leavesOnly: false })
        .value();
      expect(_.size(index)).equal(30);
    });
  }
  it('returns empty obj', () => {
    let index = _.index(1);
    expect(index).to.deep.equal({});

    index = _.index('123');
    expect(index).to.deep.equal({});

    index = _.index(null);
    expect(index).to.deep.equal({});

    index = _.index(undefined);
    expect(index).to.deep.equal({});

    index = _.index(() => {});
    expect(index).to.deep.equal({});

    index = _.index(new Date());
    expect(index).to.deep.equal({});

    index = _.index(/.*/);
    expect(index).to.deep.equal({});
  });
  it('Leafs only', () => {
    let index = _.index(demo, { leavesOnly: true });
    // console.log(index);
    expect(_.size(index)).equal(14);
  });

  it('Leafs only circular', () => {
    let index = _.index(circular, { checkCircular: true, leavesOnly: true });
    expect(_.size(index)).equal(12);
    index = _.index(circular, {
      checkCircular: true,
      includeCircularPath: false,
      leavesOnly: true,
    });
    expect(_.size(index)).equal(9);
  });
  it('empty props', () => {
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    let index = _.index(o);
    expect(_.size(index)).equal(2);
    var a = ['a', 'b', 'c'];
    delete a[1];
    index = _.index(a);
    expect(_.size(index)).equal(2);
    var slots = ['start', , 'middle', , 'finish'];
    index = _.index(slots);
    expect(_.size(index)).equal(3);
  });
  it('No leavesOnly in tree', () => {
    try {
      _.index(children, { childrenPath: 'children', leavesOnly: true });
    } catch (exc) {
      expect(exc.message).equal(
        '"leavesOnly" option cannot be true in the "tree" mode.'
      );
    }
  });
  it('Indexate tree', () => {
    let index = _.index(children, { childrenPath: 'children' });
    let names = _.values(index);
    names = _.map(names, 'name');
    // console.log(names);
    expect(names).to.deep.equal([
      'grand 1',
      'parent 1.1',
      'child 1.1.1',
      'child 1.1.2',
      'parent 1.2',
      'child 1.2.1',
      'child 1.2.2',
      'grand 2',
      'parent 2.1',
      'child 2.1.1',
      'child 2.1.2',
      'parent 2.2',
      'child 2.2.1',
      'child 2.2.2',
    ]);
  });
});
