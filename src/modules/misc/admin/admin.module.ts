import {Module} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {AdminService} from "./admin.service";
import {SecretsModule} from "../../security/secrets/secrets.module";

@Module({
    controllers: [AdminController],
    providers: [AdminService],
    imports: [SecretsModule],
})
export class AdminModule{}
