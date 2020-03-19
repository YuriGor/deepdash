/* build/tpl */
import forEachDeep from "./forEachDeep";
interface IForEachDeepAdded {
  forEachDeep: typeof forEachDeep;
}

export default function addForEachDeep<Src>(_: Src): Src & IForEachDeepAdded;

