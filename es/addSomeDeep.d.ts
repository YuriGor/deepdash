/* build/tpl */
import someDeep from "./someDeep";
interface ISomeDeepAdded {
  someDeep: typeof someDeep;
}

export default function addSomeDeep<Src>(_: Src): Src & ISomeDeepAdded;

