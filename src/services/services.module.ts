import {EncryptionService} from "./encryption.service";
import {PrismaService} from "./prisma.service";
import {TokensService} from "./tokens.service";
import {EmailService} from "./email.service";
import {TotpService} from "./totp.service";
import {JwtService} from "./jwt.service";
import {Module} from "@nestjs/common";

@Module({
    providers: [EncryptionService, JwtService, PrismaService, TokensService, TotpService, EmailService],
    exports: [EncryptionService, JwtService, PrismaService, TokensService, TotpService, EmailService]
})
export class ServicesModule{}
