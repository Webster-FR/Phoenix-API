import {Module} from "@nestjs/common";
import {AuthModule} from "./auth/auth.module";
import {VersionModule} from "./version/version.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [AuthModule, VersionModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule{}
