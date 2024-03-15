import {SetMetadata} from "@nestjs/common";

export function UseAT(){
    return SetMetadata("private", true);
}
