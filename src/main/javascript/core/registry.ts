import {DTO} from "../type";

export interface MapperReference<T, U extends string>
{}

export interface TypeMapper<T, U extends string>
{
    canRead(o:any): o is DTO<U>

    read(dto: DTO<U>, registry:Registry): T

    canWrite(o:any): o is T

    write<V extends T>(source: V, registry:Registry): DTO<U>
}


export default class Registry
{
    constructor(private readonly mappers:ReadonlyMap<MapperReference<any, string>, TypeMapper<any, string>>) {}

    public getObjectMapper<T, U extends string>(ref:MapperReference<T, U>): TypeMapper<T, U>
    {
        if (this.mappers.has(ref)) {
            const mapping = this.mappers.get(ref);
            return mapping as TypeMapper<T, U>
        }

        throw new Error("mapping not found")
    }

    public filter(pred:(value:TypeMapper<any, string>) => boolean) : Array<TypeMapper<any, string>>
    {
        const accepted:Array<TypeMapper<any, string>> = [];

        for(const value of this.mappers.values()) {
            if (pred(value)) {
                accepted.push(value)
            }
        }

        return accepted;
    }
}