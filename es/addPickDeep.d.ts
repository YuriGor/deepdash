/* build/tpl */
import pickDeep from "./pickDeep.js";
interface IPickDeepAdded {
  pickDeep: typeof pickDeep;
}

export default function addPickDeep<Src>(_: Src): Src & IPickDeepAdded;

