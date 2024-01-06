import {Module} from "@nestjs/common";
import {JwtService} from "./jwt.service";
import {EncryptionService} from "./encryption.service";
import {PrismaService} from "./prisma.service";
import {TokensService} from "./tokens.service";
import {TotpService} from "./totp.service";
import {EmailService} from "./email.service";
import {SecretsService} from "./secrets.service";

@Module({
    providers: [EncryptionService, JwtService, PrismaService, TokensService, TotpService, EmailService, SecretsService],
    exports: [EncryptionService, JwtService, PrismaService, TokensService, TotpService, EmailService, SecretsService]
})
export class ServicesModule{}
