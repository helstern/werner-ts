import {JsonType} from "./json";

export interface DTO<U extends string> {
    "@werner": U
    [key: string] : JsonType | DTO<string>
}

export function isDTO(o:any, type:string) : o is DTO<typeof type> { return typeof o === 'object' && o["@werner"] === type }
