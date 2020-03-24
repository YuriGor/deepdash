'use strict';

var { demo, circular } = require('./object')();
var { forLodashes, it, expect } = require('./common.js');

forLodashes(['eachDeep', 'filterDeep'], (_) => {
  //https://github.com/lodash/lodash/issues/591
  it('deep filtering & deep finding', () => {
    let imgCollection = [
      {
        title: 'Group 1',
        images: [
          {
            key1: 'dont even look',
            key2: 'bad',
            url: '//somewhere.jpg',
            width: '78',
          },
          {
            key1: 'boring',
            key2: 'bad too',
            url: '//somewhereelse.png',
            width: '13',
          },
          {
            key1: 'take this',
            key2: 'its good',
            url: '//there.svg',
            width: '100500',
          },
        ],
      },
      {
        title: 'Group 2',
        images: [
          {
            key1: 'its a porn',
            key2: 'no, no..',
            url: '//everywhere.bmp',
            width: '35',
          },
          {
            key1: 'take this',
            key2: 'perfect',
            url: '//here.tiff',
            width: '200500',
          },
          {
            key1: 'proprietary',
            key2: '(c)',
            url: '//wellyouknow.psd',
            width: '77',
          },
        ],
      },
    ];
    let images = [];
    _.eachDeep(imgCollection, (value, key, parent, ctx) => {
      if (key == 'key1' && value == 'take this') images.push(ctx.parent);
    });
    expect(images.length);
  });
  it('omitDeep #3', () => {
    var obj = {
      a: { b: { c: [{ x: 1, y: 2, z: 3, __typename: 'nobodyCares' }] } },
    };
    var clean = _.filterDeep(obj, function(value, key) {
      return key != '__typename';
    });
    expect(clean);
  });
});
