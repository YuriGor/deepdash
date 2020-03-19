/* build/tpl */
import findDeep from "./findDeep";
interface IFindDeepAdded {
  findDeep: typeof findDeep;
}

export default function addFindDeep<Src>(_: Src): Src & IFindDeepAdded;

