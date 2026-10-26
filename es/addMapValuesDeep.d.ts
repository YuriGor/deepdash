/* build/tpl */
import mapValuesDeep from "./mapValuesDeep.js";
interface IMapValuesDeepAdded {
  mapValuesDeep: typeof mapValuesDeep;
}

export default function addMapValuesDeep<Src>(_: Src): Src & IMapValuesDeepAdded;

