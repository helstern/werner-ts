import {Action} from "./api";
import Registry, {MapperReference, TypeMapper} from "./registry";

export default class ActionAnyOf implements Action
{
    constructor(public readonly property:string, public readonly refs: ReadonlyArray<MapperReference<unknown, string>>) {}

    private mappers:Array<TypeMapper<unknown, string>> = [];

    private getMappers(registry:Registry): ReadonlyArray<TypeMapper<any, string>>
    {
        if (this.mappers.length === 0) {
            this.mappers = this.refs.map(ref => registry.getObjectMapper(ref));
        }

        return this.mappers;
    }

    write(src:Array<object>, dest:Array<object>, mappings:Registry) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        const source = srcCurrent[this.property];

        const mapper = this.getMappers(mappings).reduce((acc:TypeMapper<unknown, string>|null, mapper) => {
            if (acc) {
                return acc;
            }

            if (mapper. canWrite(source)) {
                return mapper;
            }
            return acc;
        }, null);

        if (!mapper) {
            throw new Error("could not find mapper")
        }

        destCurrent[this.property] = mapper.write(source, mappings)
    }

    read(src:Array<object>, dest:Array<object>, mappings:Registry) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        const dto = destCurrent[this.property];

        const mapper = this.getMappers(mappings).reduce((acc:TypeMapper<unknown, string>|null, mapper) => {
            if (acc) {
                return acc;
            }

            if (mapper.canRead(dto)) {
                return mapper;
            }
            return acc;
        }, null);

        if (!mapper) {
            throw new Error("could not find mapper")
        }

        srcCurrent[this.property] = mapper.read(dto, mappings);
    }
}