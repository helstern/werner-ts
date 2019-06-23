import { BidiConverter } from '../converters';
import { JsonType } from '../json';

export default class JsonConverter<T extends JsonType> implements BidiConverter<T, T> {
  public write = (src: T): T => JSON.parse(JSON.stringify(src)) as T;

  public read = (src: T): T => JSON.parse(JSON.stringify(src)) as T;
}
