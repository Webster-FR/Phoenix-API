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

    decryptUserData(user: UserEntity): UserEntity{
        user.secret = this.encryptionService.decryptSymmetric(user.secret, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"));
        user.username = this.encryptionService.decryptSymmetric(user.username, user.secret);
        return user;
    }

    async isUserExists(id: number): Promise<boolean>{
        const user: UserEntity = await this.prismaService.user.findUnique({where: {id: id}});
        return !!user;
    }

    async findById(id: number, exception: boolean = true): Promise<UserEntity>{
        const user: UserEntity = await this.prismaService.user.findUnique({where: {id: id}});
        if(!user && exception)
            throw new NotFoundException("User not found");
        return this.decryptUserData(user);
    }

    async findByEmail(email: string, exception: boolean = true): Promise<UserEntity>{
        const user: UserEntity = await this.prismaService.user.findUnique({where: {email: email}});
        if(!user)
            if(exception)
                throw new NotFoundException("User not found");
            else
                return null;
        return this.decryptUserData(user);
    }

    async createUser(username: string, email: string, password: string): Promise<UserEntity>{
        const passwordHash = await this.encryptionService.hash(password);
        const userSecret = this.encryptionService.generateSecret();
        const encryptedUserSecret = this.encryptionService.encryptSymmetric(userSecret, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"));
        const encryptedUsername = this.encryptionService.encryptSymmetric(username, userSecret);
        const user = await this.prismaService.user.create({
            data: {
                username: encryptedUsername,
                email,
                password: passwordHash,
                secret: encryptedUserSecret,
            },
        });
        const verificationCode = await this.verificationCodeService.generateNewCode();
        return await this.setVerificationCode(user.id, verificationCode.id);
    }

    async setVerificationCode(userId: number, verificationCodeId: number): Promise<UserEntity>{
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                verification_code_id: verificationCodeId,
            },
        });
        return this.findById(userId);
    }

    async clearVerificationCode(userId: number): Promise<UserEntity>{
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                verification_code_id: null,
            },
        });
        return this.findById(userId);
    }

    async updateUsername(id: number, newUsername: string): Promise<UserEntity>{
        if(!await this.isUserExists(id))
            throw new NotFoundException("User not found");
        const user = await this.findById(id);
        const encryptedUsername = this.encryptionService.encryptSymmetric(newUsername, user.secret);
        await this.prismaService.user.update({where: {id: id}, data: {username: encryptedUsername}});
        user.username = newUsername;
        return user;
    }

    async updatePassword(id: number, newPassword: string): Promise<UserEntity>{
        if(!await this.isUserExists(id))
            throw new NotFoundException("User not found");
        const passwordHash = await this.encryptionService.hash(newPassword);
        await this.prismaService.user.update({where: {id: id}, data: {password: passwordHash}});
        return this.findById(id);
    }

    async deleteUser(id: number){
        if(!await this.isUserExists(id))
            throw new NotFoundException("User not found");
        this.prismaService.user.delete({where: {id: id}});
    }

    async findByVerificationCode(verificationCodeId: number){
        const user = await this.prismaService.user.findUnique({where: {verification_code_id: verificationCodeId}});
        if(!user)
            throw new NotFoundException("User not found");
        return this.decryptUserData(user);
    }
}
