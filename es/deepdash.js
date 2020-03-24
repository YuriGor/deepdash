/* build/tpl */
import addCondense from './addCondense';
import addCondenseDeep from './addCondenseDeep';
import addEachDeep from './addEachDeep';
import addExists from './addExists';
import addFilterDeep from './addFilterDeep';
import addFindDeep from './addFindDeep';
import addFindPathDeep from './addFindPathDeep';
import addFindValueDeep from './addFindValueDeep';
import addForEachDeep from './addForEachDeep';
import addIndex from './addIndex';
import addKeysDeep from './addKeysDeep';
import addMapDeep from './addMapDeep';
import addMapKeysDeep from './addMapKeysDeep';
import addMapValuesDeep from './addMapValuesDeep';
import addOmitDeep from './addOmitDeep';
import addPathMatches from './addPathMatches';
import addPathToString from './addPathToString';
import addPaths from './addPaths';
import addPickDeep from './addPickDeep';
import addReduceDeep from './addReduceDeep';
import addSomeDeep from './addSomeDeep';

export default function apply(_) {
  addCondense(_);
  addCondenseDeep(_);
  addEachDeep(_);
  addExists(_);
  addFilterDeep(_);
  addFindDeep(_);
  addFindPathDeep(_);
  addFindValueDeep(_);
  addForEachDeep(_);
  addIndex(_);
  addKeysDeep(_);
  addMapDeep(_);
  addMapKeysDeep(_);
  addMapValuesDeep(_);
  addOmitDeep(_);
  addPathMatches(_);
  addPathToString(_);
  addPaths(_);
  addPickDeep(_);
  addReduceDeep(_);
  addSomeDeep(_);

  return _;
}
