'use strict';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  assert = require('assert'),
  _ = require('../deepdash')(require('lodash'));
var { demo, circular } = require('./object');

describe('issues', () => {
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
      }
    ];
    let images = [];
    _.eachDeep(
      imgCollection,
      (value, key, path, depth, parent) => {
        if(key=="key1" && value=="take this")
          images.push(parent);
      }
    );
    expect(images.length).equal(2);
  });
});
