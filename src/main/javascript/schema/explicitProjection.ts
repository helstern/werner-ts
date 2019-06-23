import {Action, MapperReference, TypeMapper, Registry} from "../core";
import {BidiConverter, Converter, isBidiConverter} from "../converters";
import {JsonArray, JsonMap} from "../json";
import Class from "../Class";
import {DTO, isDTO} from "../type";
import {ReferenceBuilder} from "./refBuilders";
import {TypeGuard} from "generic-type-guard";

function isFunction(o:any): o is (arg:any) => any
{
    return typeof o === 'function'
}

type PrimitiveConverter<T extends string|boolean|number|Array<boolean>|Array<string>|Array<number>> = BidiConverter<T, boolean>
    | BidiConverter<T, number>
    | BidiConverter<T, string>
    | BidiConverter<T, null>
    | BidiConverter<T, JsonArray>
    | BidiConverter<T, JsonMap>
    ;

export type TypeConverter<T> = T extends string ? boolean | PrimitiveConverter<T>  :
    T extends Array<string> ? boolean | PrimitiveConverter<T> :
        T extends boolean ? boolean | PrimitiveConverter<T> :
            T extends Array<boolean> ? boolean | PrimitiveConverter<T> :
                T extends number ? boolean | PrimitiveConverter<T> :
                    T extends Array<number> ? boolean | PrimitiveConverter<T> :
                        BidiConverter<T, boolean>
                        | BidiConverter<T, number>
                        | BidiConverter<T, string>
                        | BidiConverter<T, null>
                        | BidiConverter<T, JsonArray>
                        | BidiConverter<T, JsonMap>

                        | ReferenceBuilder<T, string>

                        | MapperReference<T, string>
                        | ReadonlyArray<ReferenceBuilder<T, string>>
    ;


export type Emitter<T> = T extends ExplicitProjection<infer T, any, infer U> ? Pick<T, U> : never;

export interface ExplicitProjection<T, U extends string, V extends keyof T>
{
    name: U

    project: {
        [P in V]: TypeConverter<T[P]>
    }

    assembler(dto: Pick<T, V>) : T
}

export class ExplicitMapperRef<T, U extends keyof T, K extends string> implements MapperReference<T, K>
{
    constructor(private readonly type:Class<ExplicitProjection<T, K, U>>) {}
}

export class ExplicitTypeMapper<T, U extends keyof T, K extends string> implements TypeMapper<T, K>
{
    constructor(readonly projection:ExplicitProjection<T, K, U>, readonly canWrite:TypeGuard<T>, private readonly actions:ReadonlyArray<Action> ) {}

    read(dto: DTO<K>, registry:Registry): T {

        if (dto["@werner"] !== this.projection.name) {
            throw new Error("unexpected dto type")
        }

        const src:Array<object> = [{}];
        const dest:Array<object>  = [dto];

        for(const action of this.actions) {
            action.read(src, dest, registry);
        }

        const props = (src.pop()! as unknown) as Pick<T, U>;
        return this.projection.assembler(props);
    }

    write<V extends T>(source: V, registry:Registry): DTO<K> {
        const src:Array<object> =  [<object>(source as unknown)];
        const dest:Array<object>  = [{}];

        for(const action of this.actions) {
            action.write(src, dest, registry);
        }

        return {
            "@werner": this.projection.name,
            ...dest.pop()!
        };
    }

    canRead(o: any): o is DTO<K> { return isDTO(o, this.projection.name) }

}
