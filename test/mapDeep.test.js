'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { demo, children } = require('./object');
var { validateIteration, forLodashes } = require('./common.js');

forLodashes(['mapDeep'], (_) => {
  it('defaults', () => {
    let res = _.mapDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx, { method: 'mapDeep' });
      if (value instanceof Date) return 'DATE SKIPPED';
      if (typeof value == 'object') return { '?': '!' };
      return (value + '').toUpperCase();
    });
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '{"?":"!","a":{"?":"!","b":{"?":"!","c":{"?":"!","d":{"0":{"?":"!","i":"0"},"1":{"?":"!","i":"1"},"2":{"?":"!","i":"2"},"3":{"?":"!","i":"3"},"4":{"?":"!","i":"4"},"5":{"?":"!","i":"5"},"6":{"?":"!","o":{"?":"!","d":"DATE SKIPPED","f":"FUNCTION() {}","skip":{"?":"!","please":{"?":"!","dont":{"?":"!","go":{"?":"!","here":"SKIP IT"}}}}}},"?":"!"},"s":"HELLO"},"b":"TRUE"},"n":"12345","u":"UNDEFINED"},"nl":{"?":"!"}}'
    );
  });
  it('leavesOnly', () => {
    let res = _.mapDeep(
      demo,
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return (value + '').toUpperCase();
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '{"a":{"b":{"c":{"d":[{"i":"0"},{"i":"1"},{"i":"2"},{"i":"3"},{"i":"4"},{"i":"5"},{"o":{"d":"DATE SKIPPED","f":"FUNCTION() {}","skip":{"please":{"dont":{"go":{"here":"SKIP IT"}}}}}}],"s":"HELLO"},"b":"TRUE"},"n":"12345","u":"UNDEFINED"},"nl":"NULL"}'
    );
  });

  it('array', () => {
    let res = _.mapDeep(
      [demo],
      (value, key, parent, ctx) => {
        validateIteration(value, key, parent, ctx, { method: 'mapDeep' });
        if (value instanceof Date) return 'DATE SKIPPED';
        return (value + '').toUpperCase();
      },
      { leavesOnly: true }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).equal(
      '[{"a":{"b":{"c":{"d":[{"i":"0"},{"i":"1"},{"i":"2"},{"i":"3"},{"i":"4"},{"i":"5"},{"o":{"d":"DATE SKIPPED","f":"FUNCTION() {}","skip":{"please":{"dont":{"go":{"here":"SKIP IT"}}}}}}],"s":"HELLO"},"b":"TRUE"},"n":"12345","u":"UNDEFINED"},"nl":"NULL"}]'
    );
  });

  it('primitive', () => {
    _.each([0, 1, 2, 'a', 'bcd', true, false, null, undefined], (v) => {
      expect(_.mapDeep(v)).to.equal(v);
    });
  });

  it('tree mode', () => {
    let res = _.mapDeep(
      children,
      (v) => {
        return { title: v.name.toUpperCase() };
      },
      { childrenPath: 'children' }
    );
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(res)).to.equal(
      '[{"title":"GRAND 1","children":[{"title":"PARENT 1.1","children":[{"title":"CHILD 1.1.1"},{"title":"CHILD 1.1.2"}]},{"title":"PARENT 1.2","children":[{"title":"CHILD 1.2.1"},{"title":"CHILD 1.2.2"}]}]},{"title":"GRAND 2","children":[{"title":"PARENT 2.1","children":[{"title":"CHILD 2.1.1"},{"title":"CHILD 2.1.2"}]},{"title":"PARENT 2.2","children":[{"title":"CHILD 2.2.1"},{"title":"CHILD 2.2.2"}]}]}]'
    );
  });
});
