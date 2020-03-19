/* build/tpl */
import omitDeep from "./omitDeep";
interface IOmitDeepAdded {
  omitDeep: typeof omitDeep;
}

export default function addOmitDeep<Src>(_: Src): Src & IOmitDeepAdded;

