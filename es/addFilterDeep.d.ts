/* build/tpl */
import filterDeep from "./filterDeep";
interface IFilterDeepAdded {
  filterDeep: typeof filterDeep;
}

export default function addFilterDeep<Src>(_: Src): Src & IFilterDeepAdded;

