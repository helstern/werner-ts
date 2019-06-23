import {Registry, TypeMapper} from "../core";
import {DTO} from "../type";
import {ObjectMapper} from "./ObjectMapper";

export default class SubtypeMapper<T, U extends string> implements ObjectMapper<T, U>
{
    constructor(private mappers:ReadonlyArray<TypeMapper<T, U>>, private registry: Registry) {}

    read(serialized: DTO<U>): T {
        const candidates = this.mappers.filter(o => o.canRead(serialized))
        if (candidates.length === 1) {
            candidates.pop()!.read(serialized, this.registry);
        }

        throw new Error("mapper not found")
    }

    write<V extends T>(source: V): DTO<U> {
        const candidates = this.mappers.filter(o => o.canWrite(source))
        if (candidates.length === 1) {
            candidates.pop()!.write(source, this.registry);
        }

        throw new Error("mapper not found")
    }
}
