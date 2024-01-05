import {VerificationCodesService} from "./verification-codes.service";
import {ServicesModule} from "../services/services.module";
import {Module} from "@nestjs/common";

@Module({
    providers: [VerificationCodesService],
    exports: [VerificationCodesService],
    imports: [ServicesModule]
})
export class VerificationCodesModule{}
