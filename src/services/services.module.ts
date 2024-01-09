import {Module} from "@nestjs/common";
import {JwtService} from "./jwt.service";
import {EncryptionService} from "./encryption.service";
import {PrismaService} from "./prisma.service";
import {TotpService} from "./totp.service";
import {EmailService} from "./email.service";

@Module({
    providers: [EncryptionService, JwtService, PrismaService, TotpService, EmailService],
    exports: [EncryptionService, JwtService, PrismaService, TotpService, EmailService],
})
export class ServicesModule{}
