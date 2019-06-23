import {Class} from "../Class";
import DefaultObjectMapper, {ObjectMapper} from "./ObjectMapper";
import {MapperReference, Registry, TypeMapper} from "../core";
import {TypeGuard} from "generic-type-guard";
import {ExplicitProjection} from "./explicitProjection";
import SubtypeMapper from "./SubtypeMapper";

export default class Schema
{
    constructor(
        private readonly registry:Registry,
        private readonly subtypes:ReadonlyMap<MapperReference<any, string>, TypeGuard<any>>,
        private readonly types:ReadonlyMap<TypeGuard<any>, MapperReference<any, string>>,
    ) {}

    public mapperFor<T, U extends keyof T, V extends string>(type: Class<ExplicitProjection<T, V, U>>): ObjectMapper<T, V> {
        const mapping = this.registry.getObjectMapper(type) as TypeMapper<T, V>;
        return new DefaultObjectMapper(mapping, this.registry);
    }

    public canMap<T>(guard:TypeGuard<T>): boolean
    {
        return this.types.has(guard);
    }

    public mapperForType<T>(guard:TypeGuard<T>) : ObjectMapper<T, string>
    {
        if (this.types.has(guard)) {
            const ref = this.types.get(guard)!;
            const typeMapper = this.registry.getObjectMapper(ref);
            return new DefaultObjectMapper(typeMapper, this.registry)
        }

        throw new Error("no mapper found")
    }

    public writerOf<T>(instance:T): ObjectMapper<T, string>
    {
        const mappings = this.registry.filter((value:TypeMapper<any, string>) => value.canWrite(instance));

        if (mappings.length === 1) {
            const mapping = mappings.pop()! as TypeMapper<T, string>;
            return new DefaultObjectMapper(mapping, this.registry);
        }

        throw new Error("no mapper found")
    }

    public subTypesMapper<T>(baseType:TypeGuard<T>):ObjectMapper<T, string>
    {
        const subtypes:Array<TypeMapper<T, string>> = [];
        this.subtypes.forEach((value, key) => {
            if (value === baseType) {
                const mapper = this.registry.getObjectMapper(key);
                subtypes.push(mapper)
            }
        });

        return new SubtypeMapper(subtypes, this.registry);
    }
}