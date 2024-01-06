import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {UserEntity} from "./models/entities/user.entity";
import {EncryptionService} from "../services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {VerificationCodesService} from "../verification-codes/verification-codes.service";
import {VerificationCodeEntity} from "../verification-codes/models/entities/verification-code.entity";

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
        await this.verificationCodeService.setCode(user.id, this.encryptionService.generateSecret());
        return this.decryptUserData(user);
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
        await this.prismaService.user.delete({where: {id: id}});
    }

    async findByVerificationCode(verificationCodeId: number){
        const code: VerificationCodeEntity = await this.verificationCodeService.findById(verificationCodeId);
        if(!code)
            throw new NotFoundException("Verification code not found");
        const user: UserEntity = await this.prismaService.user.findUnique({where: {id: code.user_id}});
        if(!user)
            throw new NotFoundException("User not found");
        return this.decryptUserData(user);
    }

    async deleteUnverifiedUsers(){
        const users = await this.prismaService.user.findMany({
            include: {
                verification_codes: true,
            },
            where: {
                created_at: {
                    lte: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours
                },
            },
        });
        let count = 0;
        for(const user of users)
            if(user.verification_codes){
                await this.prismaService.user.delete({where: {id: user.id}});
                count++;
            }
        return count;
    }
}
