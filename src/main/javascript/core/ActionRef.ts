import {Action} from "./api";
import Registry, {MapperReference} from "./registry";

export default class ActionRef<T, U extends string> implements Action
{
    constructor(public readonly property:string, public readonly ref: MapperReference<T, U>) {}

    write(src:Array<object>, dest:Array<object>, mappings:Registry) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        const mapper = mappings.getObjectMapper(this.ref);
        destCurrent[this.property] = mapper.write(srcCurrent[this.property], mappings);
    }

    read(src:Array<object>, dest:Array<object>, mappings:Registry) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        const mapper = mappings.getObjectMapper(this.ref);
        srcCurrent[this.property] = mapper.read(destCurrent[this.property], mappings);
    }
}