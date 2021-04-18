/* build/tpl */
import addCondense from './addCondense.js';
import addCondenseDeep from './addCondenseDeep.js';
import addEachDeep from './addEachDeep.js';
import addExists from './addExists.js';
import addFilterDeep from './addFilterDeep.js';
import addFindDeep from './addFindDeep.js';
import addFindPathDeep from './addFindPathDeep.js';
import addFindValueDeep from './addFindValueDeep.js';
import addForEachDeep from './addForEachDeep.js';
import addIndex from './addIndex.js';
import addKeysDeep from './addKeysDeep.js';
import addMapDeep from './addMapDeep.js';
import addMapKeysDeep from './addMapKeysDeep.js';
import addMapValuesDeep from './addMapValuesDeep.js';
import addOmitDeep from './addOmitDeep.js';
import addPathMatches from './addPathMatches.js';
import addPathToString from './addPathToString.js';
import addPaths from './addPaths.js';
import addPickDeep from './addPickDeep.js';
import addReduceDeep from './addReduceDeep.js';
import addSomeDeep from './addSomeDeep.js';

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
