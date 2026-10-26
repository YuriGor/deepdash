/* build/tpl */
import reduceDeep from "./reduceDeep.js";
interface IReduceDeepAdded {
  reduceDeep: typeof reduceDeep;
}

export default function addReduceDeep<Src>(_: Src): Src & IReduceDeepAdded;

