/* build/tpl */
import someDeep from "./someDeep.js";
interface ISomeDeepAdded {
  someDeep: typeof someDeep;
}

export default function addSomeDeep<Src>(_: Src): Src & ISomeDeepAdded;

