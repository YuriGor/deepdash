/* build/tpl */
import findPathDeep from "./findPathDeep";
interface IFindPathDeepAdded {
  findPathDeep: typeof findPathDeep;
}

export default function addFindPathDeep<Src>(_: Src): Src & IFindPathDeepAdded;

