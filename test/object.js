'use strict';

var circular = {
  a: {
    b: {
      c: {
        // e: circular.a.b,
      },
    },
  },
  i: [
    1,
    2,
    3,
    4,
    { hello: 'world' }
  ],
};
circular.a.b.c.e = circular.a.b;
circular.i.push([circular, [circular.a], { j: circular.i[4] }, { k: circular.i[5] }]);

module.exports = {
  demo: {
    a: {
      b: {
        c: {
          d: [
            { i: 0 },
            { i: 1 },
            { i: 2 },
            { i: 3 },
            { i: 4 },
            { i: 5 },
            {
              o: {
                d: new Date(),
                f: function() {},
                skip: {
                  please: {
                    dont: {
                      go: {
                        here: 'skip it',
                      },
                    },
                  },
                },
              },
            },
          ],
          s: 'hello',
        },
        b: true,
      },
      n: 12345,
      u: undefined,
    },
    nl: null,
  },
  circular,
};
