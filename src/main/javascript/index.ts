import {IdentityConverter} from "./converters";

export {
  StringConverter,
  BidiConverter,
  IdentityConverter,
  BooleanConverter,
  NumberConverter,
  JsonConverter,
  Converter,
} from './converters';

export { ImplicitProjection, ExplicitProjection, Emitter, ObjectMapper, Schema, SchemaBuilder, refExplicit, refImplicit} from './schema';

export { JsonType, JsonMap, JsonArray } from './json';

export function identity<T>():IdentityConverter<T> {
  return new IdentityConverter<T>();
}

export { DTO } from './type'
export { converter } from './builders'
