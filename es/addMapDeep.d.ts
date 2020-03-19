/* build/tpl */
import mapDeep from "./mapDeep";
interface IMapDeepAdded {
  mapDeep: typeof mapDeep;
}

export default function addMapDeep<Src>(_: Src): Src & IMapDeepAdded;

