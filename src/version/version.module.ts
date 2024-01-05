import {VersionController} from "./version.controller";
import {Module} from "@nestjs/common";

@Module({
    controllers: [VersionController],
})
export class VersionModule{}
