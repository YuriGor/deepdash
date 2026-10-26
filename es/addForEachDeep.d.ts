/* build/tpl */
import forEachDeep from "./forEachDeep.js";
interface IForEachDeepAdded {
  forEachDeep: typeof forEachDeep;
}

export default function addForEachDeep<Src>(_: Src): Src & IForEachDeepAdded;

