export type JsonType = boolean | number | string | null | JsonArray | JsonMap;
export interface JsonMap {
  [key: string]: JsonType;
}
export interface JsonArray extends Array<JsonType> {}

export type JsonDTO<T, U extends keyof T> =
{
    [P in U] : T[P] extends boolean ? boolean :
      T[P] extends string ? string :
      T[P] extends number ? number :
      T[P] extends null ? null :
      T[P] extends Array<any> ? JsonArray : JsonMap
}
