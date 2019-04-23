import addPathToString from './addPathToString';
import addEachDeep from './addEachDeep';
import addForEachDeep from './addForEachDeep';
import addIndex from './addIndex';
import addPaths from './addPaths';
import addKeysDeep from './addKeysDeep';
import addExists from './addExists';
import addCondense from './addCondense';
import addCondenseDeep from './addCondenseDeep';
import addFilterDeep from './addFilterDeep';
import addOmitDeep from './addOmitDeep';
import addPickDeep from './addPickDeep';
import addObtain from './addObtain';
import addPathMatches from './addPathMatches';

export default function apply(_) {
  addPathToString(_);
  addEachDeep(_);
  addForEachDeep(_);
  addIndex(_);
  addPaths(_);
  addKeysDeep(_);
  addExists(_);
  addCondense(_);
  addCondense(_);
  addCondenseDeep(_);
  addFilterDeep(_);
  addOmitDeep(_);
  addPickDeep(_);
  addObtain(_);
  addPathMatches(_);
  return _;
}

if (typeof _ !== 'undefined') {
  apply(_); // eslint-disable-line no-undef
}
