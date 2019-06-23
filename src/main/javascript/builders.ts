import {Converter, BidiConverter} from "./converters";

export function converter<SRC, DEST>(o:{write: Converter<SRC, DEST>, read: Converter<DEST, SRC>}): BidiConverter<SRC, DEST>
{
    return o
}

