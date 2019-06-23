import * as tg from "generic-type-guard";

export type Converter<T, U> = (input: T) => U;

export interface BidiConverter<SRC, DEST>
{
  write: Converter<SRC, DEST>;

  read: Converter<DEST, SRC>;
}

export class IdentityConverter<T> implements BidiConverter<T, T> {
  public write = (src: T): T => src;
  public read = (src: T): T => src;
}

function isFunction(o:any): o is (arg:any) => any
{
  return typeof o === 'function'
}

export function isBidiConverter(o: any): o is BidiConverter<unknown, unknown> {
  return tg.isObject(o)
      && tg.hasProperty("fromSource", isFunction)(o)
      &&  tg.hasProperty("toSource", isFunction)(o)
  ;
}

export default Converter;
