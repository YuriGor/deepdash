/* build/tpl */
import mapValuesDeep from "./mapValuesDeep";
interface IMapValuesDeepAdded {
  mapValuesDeep: typeof mapValuesDeep;
}

export default function addMapValuesDeep<Src>(_: Src): Src & IMapValuesDeepAdded;

