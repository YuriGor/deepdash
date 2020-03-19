/* build/tpl */
import findValueDeep from "./findValueDeep";
interface IFindValueDeepAdded {
  findValueDeep: typeof findValueDeep;
}

export default function addFindValueDeep<Src>(_: Src): Src & IFindValueDeepAdded;

