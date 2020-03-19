/* build/tpl */
import pickDeep from "./pickDeep";
interface IPickDeepAdded {
  pickDeep: typeof pickDeep;
}

export default function addPickDeep<Src>(_: Src): Src & IPickDeepAdded;

