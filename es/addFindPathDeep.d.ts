/* build/tpl */
import findPathDeep from "./findPathDeep.js";
interface IFindPathDeepAdded {
  findPathDeep: typeof findPathDeep;
}

export default function addFindPathDeep<Src>(_: Src): Src & IFindPathDeepAdded;

