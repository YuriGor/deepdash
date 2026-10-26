/* build/tpl */
import condenseDeep from "./condenseDeep.js";
interface ICondenseDeepAdded {
  condenseDeep: typeof condenseDeep;
}

export default function addCondenseDeep<Src>(_: Src): Src & ICondenseDeepAdded;

