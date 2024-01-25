import {Module} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {AdminService} from "./admin.service";
import {SecretsModule} from "../../security/secrets/secrets.module";
import {ServicesModule} from "../../../common/services/services.module";

@Module({
    controllers: [AdminController],
    providers: [AdminService],
    imports: [SecretsModule, ServicesModule],
})
export class AdminModule{}
