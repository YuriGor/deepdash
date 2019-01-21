'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
var { demo, circular } = require('./object');

describe('eachDeep', () => {
  it('Count nodes', () => {
    let c = 0;
    _.eachDeep(
      demo,
      (value, key, path, depth, parent, parentKey, parentPath) => {
        if (key == 'skip') return false;
        c++;
      }
    );
    expect(c).equal(25);
  });
  it('Chaining', () => {
    let c = 0;
    _(demo)
      .eachDeep((value, key, path, depth, parent, parentKey, parentPath) => {
        if (key == 'skip') return false;
        c++;
      })
      .value();
    expect(c).equal(25);
  });
  it('alias forEachDeep', () => {
    let c = 0;
    _.forEachDeep(demo, (value, key) => {
      c++;
    });
    expect(c).equal(30);
  });
  it('returns collection', () => {
    let c = _.forEachDeep(demo, (value, key) => {
      /*hello?*/
    });
    expect(c).equal(demo);
  });
  it('no callback', () => {
    let c = _.forEachDeep(demo);
    expect(c).equal(demo);
    c = _(demo)
      .forEachDeep()
      .value();
    expect(c).equal(demo);
  });

  it('circular', () => {
    let circluarPath = [];
    _.eachDeep(
      circular,
      (value, key, path, depth, parent, parentKey, parentPath, parents) => {
        if (parents.values.indexOf(value) != -1) {
          circluarPath.push(path);

          return false;
        }
      },
      { track: true }
    );

    expect(circluarPath)
      .to.include('a.b.c.e')
      .and.to.include('i[5][0]')
      .and.to.include('i[5][1][0].b.c.e')
      .and.to.have.property('length')
      .and.equal(3);
  });

  it('Array', () => {
    let c = 0;
    _.eachDeep(
      [demo, demo],
      (value, key, path, depth, parent, parentKey, parentPath) => {
        if (key == 'skip') return false;
        c++;
      }
    );
    expect(c).equal(52);
  });

  it('String', () => {
    let c = 0;
    _.eachDeep(
      'Hello?',
      (value, key, path, depth, parent, parentKey, parentPath) => {
        if (key == 'skip') return false;
        c++;
      }
    );
    expect(c).equal(0);
  });
  it('empty props', () => {
    let c = 0;
    var o = { a: 0, b: 1, c: 2 };
    delete o.b;
    _.eachDeep(o, () => {
      c++;
    });
    expect(c).equal(2);
    c = 0;
    var a = ['a', 'b', 'c'];
    delete a[1];
    _.eachDeep(a, () => {
      c++;
    });
    expect(c).equal(2);
    c = 0;
    var slots = ['start', , 'middle', , 'finish'];
    _.eachDeep(slots, () => {
      c++;
    });
    expect(c).equal(3);
  });
  it('generated string paths are correct', () => {
    _.eachDeep(demo, function(value, key, path) {
      assert(_.has(demo, path), 'Incorrect path: ' + path);
    });
  });
  it('generated array paths are correct', () => {
    _.eachDeep(
      demo,
      function(value, key, path) {
        assert(_.has(demo, path), 'Incorrect path: ' + path);
      },
      { pathFormat: 'array' }
    );
  });
});
