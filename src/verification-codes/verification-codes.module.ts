import {Module} from "@nestjs/common";
import {VerificationCodesService} from "./verification-codes.service";
import {ServicesModule} from "../services/services.module";

@Module({
    providers: [VerificationCodesService],
    exports: [VerificationCodesService],
    imports: [ServicesModule]
})
export class VerificationCodesModule{}
