import {Module} from "@nestjs/common";
import {VerificationCodesModule} from "./verification-codes/verification-codes.module";


@Module({
    imports: [VerificationCodesModule],
})
export class SecurityModule{}
