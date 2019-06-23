import Registry from "./registry";

export interface Action
{
    write(src:Array<object>, dest:Array<object>, mappings:Registry): void;

    read(src:Array<object>, dest:Array<object>, mappings:Registry): void;
}

export interface ObjectAction extends Action {
    isEnd: boolean
}
