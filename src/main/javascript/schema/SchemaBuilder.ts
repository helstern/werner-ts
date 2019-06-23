import {
    ExplicitTypeMapper, ExplicitMapperRef, ExplicitProjection
} from "./explicitProjection";

import {
    ImplicitMapperRef, ImplicitProjection,
    ImplicitTypeMapper
} from "./implicitProjection"

import {Class} from "../Class";
import {TypeMapper, Action, MapperReference, ActionRef, ActionAnyOf, ActionBiDiConverter} from "../core";

import {IdentityConverter, isBidiConverter} from "../converters";
import Schema from "./Schema";
import Registry from "../core/registry";
import {isReferenceBuilder} from "./refBuilders";
import {TypeGuard} from "generic-type-guard";


function traverse<T, U extends keyof T, V extends string>(projection:ExplicitProjection<T, V, U>, builder:SchemaBuilder): ReadonlyArray<Action>
{
    return Object.keys(projection.project).map((key:string) => {

        const property = (<any>projection.project)[key];

        if (typeof property === "boolean") {
            return new ActionBiDiConverter<any>(key, new IdentityConverter())
        }  else if (isBidiConverter(property)){
            return new ActionBiDiConverter<any>(key, property);
        } else if(isReferenceBuilder(property)) {
            const ref = property.register(builder);
            return new ActionRef(key, ref)
        } else if(property instanceof Array) {
            const refs = property.map(o => {
                if (!isReferenceBuilder(o)) {
                    throw new Error("invalid property type")
                }
                return o.register(builder);
            });

            return new ActionAnyOf(key, refs)
        }

        console.error(key);
        console.error(property);
        throw new Error("unknown property converter type")
    });
}


export default class SchemaBuilder
{
    static instance(): SchemaBuilder
    {
        return new SchemaBuilder(new Map());
    }

    private rootTypeRefs:Map<Class<ExplicitProjection<any, string, any>>, MapperReference<any, string>> = new Map();

    private typeRefs:Map<Class<ImplicitProjection<any, string>>, MapperReference<any, string>> = new Map();

    private subtypes:Map<MapperReference<any, string>, TypeGuard<any>> = new Map();

    private types:Map<TypeGuard<any>, MapperReference<any, string>> = new Map();

    constructor(private readonly mappers:Map<MapperReference<any, string>, TypeMapper<any, string>>) {}

    addSubType<K, T extends K, U extends keyof T, V extends string>(parent:TypeGuard<K>, key:Class<ExplicitProjection<T, V, U>>): SchemaBuilder
    {
        const ref = this.rootTypeRefs.get(key)!;
        this.subtypes.set(ref, parent);

        return this;
    }

    addExplicitMapping<T, U extends string, V extends keyof T>(
        type:TypeGuard<T>,
        projection: Class<ExplicitProjection<T, U, V>>
    ): SchemaBuilder {
        const instance = new projection();
        const actions = traverse(instance, this);

        const ref = this.explicitProjectionRef(projection);
        this.mappers.set(ref, new ExplicitTypeMapper(instance, type, actions) as TypeMapper<any, U>);
        this.types.set(type, ref);
        return this;
    }

    addImplicitMapping<T, U extends string>(
        type:TypeGuard<T>,
        projection: Class<ImplicitProjection<T, U>>
    ): SchemaBuilder {

        const instance = new projection();
        const ref = this.implicitProjectionRef(projection);
        this.mappers.set(ref, new ImplicitTypeMapper(instance, type) as TypeMapper<any, U>);
        this.types.set(type, ref);
        return this;
    }

    explicitProjectionRef<T, U extends keyof T, V extends string>(key:Class<ExplicitProjection<T, V, U>>): MapperReference<T, V>
    {
        if (this.rootTypeRefs.has(key)) {
            return this.rootTypeRefs.get(key) as MapperReference<T, V>;
        }

        const ref = new ExplicitMapperRef<T, U, V>(key);
        this.rootTypeRefs.set(key, ref);
        return ref;
    }

    implicitProjectionRef<T, U extends string>(key:Class<ImplicitProjection<T, U>>): MapperReference<T, U>
    {
        const lookupKey = key as unknown as Class<ImplicitProjection<any, string>>

        if (this.typeRefs.has(lookupKey)) {
            return this.typeRefs.get(lookupKey) as MapperReference<T, U>;
        }

        const ref = new ImplicitMapperRef<T, U>(key);
        this.typeRefs.set(lookupKey, ref);
        return ref;
    }

    build() : Schema
    {
        const registry = new Registry(this.mappers);
        return new Schema(registry, this.subtypes, this.types);
    }
}
