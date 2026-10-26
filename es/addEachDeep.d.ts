/* build/tpl */
import eachDeep from "./eachDeep.js";
interface IEachDeepAdded {
  eachDeep: typeof eachDeep;
}

export default function addEachDeep<Src>(_: Src): Src & IEachDeepAdded;

