/* build/tpl */
import keysDeep from "./keysDeep.js";
interface IKeysDeepAdded {
  keysDeep: typeof keysDeep;
}

export default function addKeysDeep<Src>(_: Src): Src & IKeysDeepAdded;

