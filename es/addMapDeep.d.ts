/* build/tpl */
import mapDeep from "./mapDeep.js";
interface IMapDeepAdded {
  mapDeep: typeof mapDeep;
}

export default function addMapDeep<Src>(_: Src): Src & IMapDeepAdded;

