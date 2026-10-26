/* build/tpl */
import filterDeep from "./filterDeep.js";
interface IFilterDeepAdded {
  filterDeep: typeof filterDeep;
}

export default function addFilterDeep<Src>(_: Src): Src & IFilterDeepAdded;

