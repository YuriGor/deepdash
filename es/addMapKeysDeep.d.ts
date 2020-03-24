/* build/tpl */
import mapKeysDeep from "./mapKeysDeep";
interface IMapKeysDeepAdded {
  mapKeysDeep: typeof mapKeysDeep;
}

export default function addMapKeysDeep<Src>(_: Src): Src & IMapKeysDeepAdded;

