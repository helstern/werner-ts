import {Action} from "./api";
import Registry, {TypeMapper} from "./registry";

export default class ActionTypeMapper<T, U extends string> implements Action
{
    constructor(public readonly property:string, public readonly mapper: TypeMapper<T, U>) {}

    write(src:Array<object>, dest:Array<object>, mappings:Registry) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        destCurrent[this.property] = this.mapper.write(srcCurrent[this.property], mappings)
    }

    read(src:Array<object>, dest:Array<object>, mappings:Registry) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        srcCurrent[this.property] = this.mapper.read(destCurrent[this.property], mappings);

        throw new Error("invalid mapper")
    }
}