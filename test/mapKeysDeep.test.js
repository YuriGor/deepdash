'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
const getObject = require('./object');
var { demo, children, circular } = getObject();
var { validateIteration, forLodashes } = require('./common.js');

forLodashes(['mapKeysDeep', 'paths'], (_) => {
  it('defaults', () => {
    let res = _.mapKeysDeep(demo, (value, key, parent, ctx) => {
      validateIteration(value, key, parent, ctx, {
        method: 'mapKeysDeep',
      });
      return key.toUpperCase();
    });
    // console.log(JSON.stringify(res));
    expect(JSON.stringify(demo)).to.deep.equal(
      JSON.stringify(getObject().demo)
    );
    expect(JSON.stringify(res)).equal(
      '{"A":{"B":{"C":{"D":[{"I":0},{"I":1},{"I":2},{"I":3},{"I":4},{"I":5},{"O":{"D":"1995-12-04T01:00:00.000Z","SKIP":{"PLEASE":{"DONT":{"GO":{"HERE":"skip it"}}}}}}],"S":"hello"},"B":true},"N":12345},"NL":null}'
    );
  });
  ['array', 'string'].forEach((pathFormat) => {
    describe(`${pathFormat} paths`, () => {
      it('leavesOnly', () => {
        let res = _.mapKeysDeep(
          demo,
          (value, key, parent, ctx) => {
            validateIteration(value, key, parent, ctx, {
              method: 'mapKeysDeep',
              pathFormat,
            });
            return key.toUpperCase();
          },
          { pathFormat, leavesOnly: true, debug: false }
        );
        // console.log(JSON.stringify(res));
        expect(JSON.stringify(demo)).to.deep.equal(
          JSON.stringify(getObject().demo)
        );
        expect(JSON.stringify(res)).equal(
          '{"a":{"b":{"c":{"d":[{"I":0},{"I":1},{"I":2},{"I":3},{"I":4},{"I":5},{"o":{"skip":{"please":{"dont":{"go":{"HERE":"skip it"}}}},"D":"1995-12-04T01:00:00.000Z"}}],"S":"hello"},"B":true},"N":12345},"NL":null}'
        );
      });

      it('array - conflict', () => {
        const src = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let res = _.mapKeysDeep(
          src,
          (value, key, parent, ctx) => {
            validateIteration(value, key, parent, ctx, {
              method: 'mapKeysDeep',
              pathFormat,
            });
            return key * 2;
          },
          { pathFormat, leavesOnly: true }
        );
        // console.log(res);
        expect(src).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        expect(res).deep.equal([0, , 1, , 2, , 3, , 4, , 5, , 6, , 7, , 8]);
      });

      it('deep array - conflict', () => {
        const src = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
        ];
        let res = _.mapKeysDeep(
          src,
          (value, key, parent, ctx) => {
            validateIteration(value, key, parent, ctx, {
              method: 'mapKeysDeep',
              pathFormat,
            });
            return key * 2;
          },
          { pathFormat, debug: false }
        );
        // console.log(res);

        expect(src).to.deep.equal([
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
        ]);

        expect(res).deep.equal([
          [0, , 1, , 2, , 3, , 4, , 5, , 6, , 7, , 8],
          ,
          [0, , 1, , 2, , 3, , 4, , 5, , 6, , 7, , 8],
          ,
          [0, , 1, , 2, , 3, , 4, , 5, , 6, , 7, , 8],
          ,
          [0, , 1, , 2, , 3, , 4, , 5, , 6, , 7, , 8],
        ]);
      });

      it('primitive', () => {
        const src = [0, 1, 2, 'a', 'bcd', true, false, null, undefined];
        _.each(src, (v) => {
          expect(_.mapKeysDeep(v, undefined, { pathFormat })).to.equal(v);
        });
        expect(src).to.deep.equal([
          0,
          1,
          2,
          'a',
          'bcd',
          true,
          false,
          null,
          undefined,
        ]);
      });

      it('tree mode', () => {
        // console.log('tree mode');
        let res = _.mapKeysDeep(
          children,
          (v, k) => {
            // console.log(k);
            return k * 2;
          },
          { pathFormat, childrenPath: 'children', debug: false }
        );

        expect(children).to.deep.equal(getObject().children);

        expect(JSON.stringify(res)).to.equal(
          '[{"name":"grand 1","children":[{"name":"parent 1.1","children":[{"name":"child 1.1.1"},null,{"name":"child 1.1.2"}]},null,{"name":"parent 1.2","children":[{"name":"child 1.2.1"},null,{"name":"child 1.2.2"}]}]},null,{"name":"grand 2","children":[{"name":"parent 2.1","children":[{"name":"child 2.1.1"},null,{"name":"child 2.1.2"}]},null,{"name":"parent 2.2","children":[{"name":"child 2.2.1"},null,{"name":"child 2.2.2"}]}]}]'
        );
      });

      it('tree mode - rootIsChildren', () => {
        let res = _.mapKeysDeep(
          { g1: children[0], g2: children[1] },
          (v, k, p, c) => {
            if (k.match(/^\d+$/)) {
              return (parseInt(k) + 1) * 2;
            }
            return k.toUpperCase() + '-';
          },
          {
            pathFormat,
            childrenPath: 'children',
            rootIsChildren: true,
            includeRoot: false,
            debug: false,
          }
        );
        // console.log(JSON.stringify(res));
        expect(children).to.deep.equal(getObject().children);
        expect(JSON.stringify(res)).to.equal(
          '{"G1-":{"name":"grand 1","children":[null,null,{"name":"parent 1.1","children":[null,null,{"name":"child 1.1.1"},null,{"name":"child 1.1.2"}]},null,{"name":"parent 1.2","children":[null,null,{"name":"child 1.2.1"},null,{"name":"child 1.2.2"}]}]},"G2-":{"name":"grand 2","children":[null,null,{"name":"parent 2.1","children":[null,null,{"name":"child 2.1.1"},null,{"name":"child 2.1.2"}]},null,{"name":"parent 2.2","children":[null,null,{"name":"child 2.2.1"},null,{"name":"child 2.2.2"}]}]}}'
        );
      });

      it('overwrite', () => {
        const src = {
          a: { b: { c: { x: '1!', y: '2!', z: '3!' } } },
          A: { B: { C: { X: '1?', Y: '2?', Z: '3?' } } },
        };
        let res = _.mapKeysDeep(
          src,
          (v, k, p, c) => {
            return k.toUpperCase();
          },
          { pathFormat }
        );

        expect(res).to.deep.equal({
          A: { B: { C: { X: '1!', Y: '2!', Z: '3!' } } },
        });
      });

      it('swap', () => {
        const src = {
          a: { b: { c: { x: '1!', y: '2!', z: '3!' } } },
          A: { B: { C: { X: '1?', Y: '2?', Z: '3?' } } },
        };
        let res = _.mapKeysDeep(
          src,
          (v, k, p, c) => {
            return k.match(/[A-Z]/) ? k.toLowerCase() : k.toUpperCase();
          },
          { pathFormat }
        );

        expect(res).to.deep.equal({
          A: { B: { C: { X: '1!', Y: '2!', Z: '3!' } } },
          a: { b: { c: { x: '1?', y: '2?', z: '3?' } } },
        });
      });
      it('easy circular', () => {
        const c = { x: {} };
        c.x.y = c;
        c.a = c.x;
        const res = _.mapKeysDeep(
          c,
          (v, k, p, c) => {
            // console.log(c.path, c.isCircular);
            return k.toUpperCase();
          },
          { pathFormat, checkCircular: true, debug: false }
        );
        const paths = _.paths(res, { checkCircular: true });
        expect(paths).to.deep.equal(['X.Y', 'A.Y']);
        assert(res.X.Y === res);
        assert(res.A === res.X);
      });
      it('circular', () => {
        const res = _.mapKeysDeep(
          circular,
          (v, k, p, c) => {
            // console.log(c.path, c.isCircular);
            return k.toUpperCase();
          },
          { pathFormat, checkCircular: true, debug: false }
        );
        // console.log(_.paths(circular, { checkCircular: true }));
        const paths = _.paths(res, { checkCircular: true });
        // console.log(paths);
        expect(paths).to.deep.equal([
          'A.B.C.HI',
          'A.B.C.E',
          'I[0]',
          'I[1]',
          'I[2]',
          'I[3]',
          'I[4].HELLO',
          'I[5][0]',
          'I[5][1][0].B.C.HI',
          'I[5][1][0].B.C.E',
          'I[5][2].J.HELLO',
          'I[5][3].K',
        ]);
        // console.log(circular.i[5]);
        // console.log(res.I[5]);
        assert(res.A.B.C.E === res.A.B);
        assert(res.I[5][0] === res);
      });
    });
  });
});
