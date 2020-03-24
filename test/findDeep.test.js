'use strict';

const chai = require('chai'),
  expect = chai.expect;

const asserttype = require('chai-asserttype');
chai.use(asserttype);
var { validateIteration, forLodashes } = require('./common.js');

var { demo, circular } = require('./object')();

forLodashes(['findDeep', 'omitDeep', 'paths'], (_) => {
  function isNS(options = {}) {
    return (value, key, parent, ctx) => {
      // console.log(`@${ctx.path}`);
      options = _.merge({ method: 'findDeep' }, options);
      validateIteration(value, key, parent, ctx, options);
      let t = typeof value;
      return t == 'number' || t == 'string';
    };
  }

  it('find object - defaults', () => {
    let found = _.findDeep(demo, isNS());

    expect(found).to.be.an('object');
    expect(found.value).equal(0);
    expect(found.key).equal('i');
    expect(found.parent).deep.equal({ i: 0 });
    expect(found.context.path).equal('a.b.c.d[0].i');
  });

  it('find array - defaults', () => {
    let found = _.findDeep([demo], isNS());
    expect(found).to.be.an('object');
    expect(found.value).equal(0);
    expect(found.key).equal('i');
    expect(found.parent).deep.equal({ i: 0 });
    expect(found.context.path).equal('[0].a.b.c.d[0].i');
  });

  it('find object - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findDeep(demo, isNS(options), options);
    expect(found).to.be.an('object');
    expect(found.value).equal(0);
    expect(found.key).equal('i');
    expect(found.parent).deep.equal({ i: 0 });
    expect(found.context.path).equal('a.b.c.d[0].i');
  });

  it('find array - not leavesOnly', () => {
    let options = {
      leavesOnly: false,
    };
    let found = _.findDeep([demo], isNS(options), options);
    expect(found).to.be.an('object');
    expect(found.value).equal(0);
    expect(found.key).equal('i');
    expect(found.parent).deep.equal({ i: 0 });
    expect(found.context.path).equal('[0].a.b.c.d[0].i');
  });

  it('find array - not leavesOnly, includeRoot', () => {
    let options = {
      leavesOnly: false,
      includeRoot: true,
    };
    let found = _.findDeep([demo], isNS(options), options);
    expect(found).to.be.an('object');
    expect(found.value).equal(0);
    expect(found.key).equal('i');
    expect(found.parent).deep.equal({ i: 0 });
    expect(found.context.path).equal('[0].a.b.c.d[0].i');
  });

  it('not found === undefined', () => {
    let obj = { a: { b: undefined } };
    let found = _.findDeep(obj, isNS());
    expect(found).to.be.an('undefined');
    obj = [{ a: { b: false } }];
    found = _.findDeep(obj, isNS());
    expect(found).to.be.an('undefined');
  });

  it('I dunno', () => {
    let found = _.findDeep(demo, (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );

    expect(found).equal(undefined);
    found = _.findDeep([demo], (value, key, parent, ctx) =>
      validateIteration(value, key, parent, ctx)
    );

    expect(found).equal(undefined);
  });
  if (!_.v) {
    it('Chaining', () => {
      let options = {
        leafsOnly: false,
      };
      let found = _(demo)
        .filterDeep(isNS())
        .findDeep((value, key, parent, ctx) => {
          validateIteration(value, key, parent, ctx, options);
          return key === 'skip';
        }, options)
        .value();
      expect(found).to.be.an('object');
      expect(found.value).deep.equal({
        please: {
          dont: {
            go: {
              here: 'skip it',
            },
          },
        },
      });
      expect(found.key).equal('skip');
      expect(found.parent).deep.equal({
        skip: {
          please: {
            dont: {
              go: {
                here: 'skip it',
              },
            },
          },
        },
      });
      expect(found.context.path).equal('a.b.c.d[6].o.skip');
    });
  }

  it('non-object', () => {
    expect(
      _.findDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(true);
    expect(
      _.findDeep(
        true,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    expect(
      _.findDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(false);
    expect(
      _.findDeep(
        false,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    expect(
      _.findDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(null);
    expect(
      _.findDeep(
        null,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    expect(
      _.findDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(undefined);
    expect(
      _.findDeep(
        undefined,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    expect(
      _.findDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(1);
    expect(
      _.findDeep(
        1,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    expect(
      _.findDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(0);
    expect(
      _.findDeep(
        0,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    expect(
      _.findDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal('hi');
    expect(
      _.findDeep(
        'hi',
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    expect(
      _.findDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal({});
    expect(
      _.findDeep(
        {},
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    let options = { includeRoot: true };
    expect(
      _.findDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx, options) || true,
        options
      ).value
    ).to.deep.equal([]);

    expect(
      _.findDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      )
    ).to.deep.equal(undefined);
    expect(
      _.findDeep(
        [],
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);
    let f = () => {};
    expect(
      _.findDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.equal(f);
    expect(
      _.findDeep(
        f,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    let dt = new Date();
    expect(
      _.findDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(dt);
    expect(
      _.findDeep(
        dt,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    let rx = /.*/;
    expect(
      _.findDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(rx);
    expect(
      _.findDeep(
        rx,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);

    let sm = Symbol('Halloo');
    expect(
      _.findDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) || true
      ).value
    ).to.deep.equal(sm);
    expect(
      _.findDeep(
        sm,
        (value, key, parent, ctx) =>
          validateIteration(value, key, parent, ctx) && false
      )
    ).to.deep.equal(undefined);
  });

  it('Circular', () => {
    let options = {
      checkCircular: true,
      leavesOnly: false,
    };
    let found = _.findDeep(circular, 'hi', options);
    expect(found.value.hi).equal('planet');
  });

  it('Sparse array', () => {
    // eslint-disable-next-line  no-sparse-arrays
    var obj = { a: [{ b: false }, , { b: true }, { b: false }] };
    var found = _.findDeep(obj, (v) => v === true);
    expect(found.context.path).equal('a[2].b');
  });
});
