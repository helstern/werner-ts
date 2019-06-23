import {BidiConverter} from "../converters";
import {Action} from "./api";
import hasKey from "./hasKey";

export default class ActionBiDiConverter<T> implements Action
{
    constructor(public readonly property:string, public readonly converter: BidiConverter<T, any>) {}

    write(src:Array<object>, dest:Array<object>) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        if (hasKey(srcCurrent, this.property)) {
            destCurrent[this.property] = this.converter.write(srcCurrent[this.property])
        } else {
            throw new Error("key not found")
        }
    }

    read(src:Array<object>, dest:Array<object>) {
        const srcCurrent = <{[key:string]: any}>src[src.length - 1]!!;
        const destCurrent = <{[key:string]: any}>dest[src.length - 1]!!;

        if (hasKey(destCurrent, this.property)) {
            srcCurrent[this.property] = this.converter.read(
                destCurrent[this.property]
            );
        }  else {
            throw new Error("key not found")
        }
    }
}