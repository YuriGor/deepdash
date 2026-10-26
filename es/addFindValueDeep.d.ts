/* build/tpl */
import findValueDeep from "./findValueDeep.js";
interface IFindValueDeepAdded {
  findValueDeep: typeof findValueDeep;
}

export default function addFindValueDeep<Src>(_: Src): Src & IFindValueDeepAdded;

