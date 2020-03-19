export default function condenseDeep<Src>(
  obj: Src,
  options?: {
    checkCircular: boolean
  }
): Src;
