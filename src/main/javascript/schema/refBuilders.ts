import {MapperReference} from "../core";
import Class from "../Class";
import SchemaBuilder from "./SchemaBuilder";
import {ImplicitProjection} from "./implicitProjection";
import {ExplicitProjection} from "./explicitProjection";

export interface ReferenceBuilder<T, U extends string>
{
    register(builder:SchemaBuilder): MapperReference<T, U>;
}

export function isReferenceBuilder(o:any): o is ReferenceBuilder<any, string>
{
    return o instanceof ExplicitMapperRefBuilder || o instanceof ImplicitMapperRefBuilder
}

export function refExplicit<T, U extends keyof T, V extends string>(type:Class<ExplicitProjection<T, V, U>>): ReferenceBuilder<T, V>
{
    return new ExplicitMapperRefBuilder(type);
}

export function refImplicit<T, U extends string>(type:Class<ImplicitProjection<T, U>>): ReferenceBuilder<T, U>
{
    return new ImplicitMapperRefBuilder(type);
}

export class ExplicitMapperRefBuilder<T, U extends keyof T, V extends string> implements ReferenceBuilder<T, V>
{
    constructor(private readonly type:Class<ExplicitProjection<T, V, U>>) {}

    register(builder:SchemaBuilder): MapperReference<T, V> {
        return builder.explicitProjectionRef(this.type)
    }
}

export class ImplicitMapperRefBuilder<T, U extends string> implements ReferenceBuilder<T, U>
{
    constructor(private readonly type:Class<ImplicitProjection<T, U>>) {}

    register(builder:SchemaBuilder): MapperReference<T, U> {
        return builder.implicitProjectionRef(this.type)
    }
}
