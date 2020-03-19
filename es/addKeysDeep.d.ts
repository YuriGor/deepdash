/* build/tpl */
import keysDeep from "./keysDeep";
interface IKeysDeepAdded {
  keysDeep: typeof keysDeep;
}

export default function addKeysDeep<Src>(_: Src): Src & IKeysDeepAdded;

