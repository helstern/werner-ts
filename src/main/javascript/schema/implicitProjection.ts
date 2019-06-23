import {BidiConverter} from '../converters';
import {DTO, isDTO} from "../type";
import {MapperReference, Registry, TypeMapper} from "../core";
import Class from "../Class";
import {JsonMap} from "../json";
import {TypeGuard} from "generic-type-guard";


export interface ImplicitProjection<T, U extends string>
{
    name: U

    project: BidiConverter<T, JsonMap>
}

export class ImplicitMapperRef<T, U extends string> implements MapperReference<T, U>
{
    constructor(private readonly type:Class<ImplicitProjection<T, U>>) {}
}

export class ImplicitTypeMapper<T, U extends string> implements TypeMapper<T, U>
{
    constructor(readonly projection:ImplicitProjection<T, U>, readonly canWrite:TypeGuard<T>) {}

    read(dto: DTO<U>, registry:Registry): T {

        if (isDTO(dto, this.projection.name)) {
            return this.projection.project.read(dto)
        }

        throw new Error("unexpected dto type");
    }

    write<V extends T>(source: V, registry:Registry): DTO<U> {

        return {
            "@werner": this.projection.name,
            ...this.projection.project.write(source)
        };
    }

    canRead(o: any): o is DTO<U> { return isDTO(o, this.projection.name) }

}




