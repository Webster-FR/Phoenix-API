import {Module} from "@nestjs/common";
import {JwtService} from "./jwt.service";
import {CipherService} from "./cipher.service";
import {PrismaService} from "./prisma.service";
import {TotpService} from "./totp.service";
import {EmailService} from "./email.service";

@Module({
    providers: [CipherService, JwtService, PrismaService, TotpService, EmailService],
    exports: [CipherService, JwtService, PrismaService, TotpService, EmailService],
})
export class ServicesModule{}
