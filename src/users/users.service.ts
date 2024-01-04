import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {UserEntity} from "./models/entities/user.entity";
import {EncryptionService} from "../services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {VerificationCodesService} from "../verification-codes/verification-codes.service";

@Injectable()
export class UsersService{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
        private readonly verificationCodeService: VerificationCodesService,
    ){}

    decryptUserSecret(user: UserEntity): UserEntity{
        user.secret = this.encryptionService.decryptSymmetric(user.secret, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"));
        return user;
    }

    async findById(id: number, exception: boolean = true): Promise<UserEntity>{
        const user: UserEntity = await this.prismaService.user.findUnique({where: {id: id}});
        if(!user && exception)
            throw new NotFoundException("User not found");
        return this.decryptUserSecret(user);
    }

    async findByEmail(email: string, exception: boolean = true): Promise<UserEntity>{
        const user: UserEntity = await this.prismaService.user.findUnique({where: {email: email}});
        if(!user)
            if(exception)
                throw new NotFoundException("User not found");
            else
                return null;
        return this.decryptUserSecret(user);
    }

    async createUser(username: string, email: string, password: string): Promise<UserEntity>{
        const passwordHash = await this.encryptionService.hash(password);
        const encryptedUserSecret = this.encryptionService.encryptSymmetric(this.encryptionService.generateSecret(), this.configService.get("SYMMETRIC_ENCRYPTION_KEY"));
        const user = await this.prismaService.user.create({
            data: {
                username: username,
                email: email,
                password: passwordHash,
                secret: encryptedUserSecret,
            },
        });
        const verificationCode = await this.verificationCodeService.generateNewCode();
        return await this.setVerificationCode(user.id, verificationCode.id);
    }

    async setVerificationCode(userId: number, verificationCodeId: number): Promise<UserEntity>{
        return this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                verification_code_id: verificationCodeId,
            },
        });
    }

    async clearVerificationCode(userId: number): Promise<UserEntity>{
        return this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                verification_code_id: null,
            },
        });
    }
}
