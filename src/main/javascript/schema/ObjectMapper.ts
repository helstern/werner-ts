import {Registry, TypeMapper} from "../core";
import {DTO} from "../type";

export interface ObjectMapper<T, U extends string>
{
    read<V extends T>(serialized: DTO<U>): T;

    write<V extends T>(source: V): DTO<U>;
}

export default class DefaultObjectMapper<T, U extends string> implements ObjectMapper<T, U>
{
    constructor(private mapping:TypeMapper<T, U>, private registry: Registry) {}

    read(serialized: DTO<U>): T {
        return this.mapping.read(serialized, this.registry);
    }

    write<V extends T>(source: V): DTO<U> {
        return this.mapping.write(source, this.registry);
    }
}

