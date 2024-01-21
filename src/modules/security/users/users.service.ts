import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {UserEntity} from "./models/entities/user.entity";
import {EncryptionService} from "../../../common/services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {VerificationCodesService} from "../verification-codes/verification-codes.service";
import {UserCacheService} from "../../cache/user-cache.service";
import {Prisma} from "@prisma/client/extension";

@Injectable()
export class UsersService{

    private readonly userSecretsEncryptionStrength = parseInt(this.configService.get("USER_SECRETS_ENCRYPTION_STRENGTH"));
    private readonly usersEncryptionStrength = parseInt(this.configService.get("USERS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
        private readonly verificationCodeService: VerificationCodesService,
        private readonly userCacheService: UserCacheService,
    ){}

    decryptUserData(user: UserEntity): UserEntity{
        user.secret = this.encryptionService.decryptSymmetric(user.secret, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.userSecretsEncryptionStrength);
        user.username = this.encryptionService.decryptSymmetric(user.username, user.secret, this.usersEncryptionStrength);
        user.email = this.encryptionService.decryptSymmetric(user.email, user.secret, this.usersEncryptionStrength);
        return user;
    }

    async isUserExists(userId: number): Promise<boolean>{
        let user: UserEntity = await this.userCacheService.getUserFromId(userId);
        if(user)
            return true;
        user = await this.prismaService.user.findUnique({where: {id: userId}});
        return !!user;
    }

    async findAll(): Promise<UserEntity[]>{
        const users: UserEntity[] = await this.prismaService.user.findMany();
        for(const user of users)
            this.decryptUserData(user);
        return users;
    }

    async findById(userId: number, exception: boolean = true): Promise<UserEntity>{
        let user = await this.userCacheService.getUserFromId(userId);
        if(user)
            return user;
        user = await this.prismaService.user.findUnique({where: {id: userId}});
        if(!user && exception)
            throw new NotFoundException("User not found");
        user = this.decryptUserData(user);
        await this.userCacheService.updateUser(user);
        return user;
    }

    async findByEmail(email: string, exception: boolean = true): Promise<UserEntity>{
        const emailSum = this.encryptionService.getSum(email).substring(0, 10);
        const users: UserEntity[] = await this.prismaService.user.findMany({where: {email_sum: emailSum}});
        if(users.length === 0)
            if(exception)
                throw new NotFoundException("User not found");
            else
                return null;
        for(const user of users){
            const decryptedUserSecret = this.encryptionService.decryptSymmetric(user.secret, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.userSecretsEncryptionStrength);
            const decryptedEmail = this.encryptionService.decryptSymmetric(user.email, decryptedUserSecret, this.usersEncryptionStrength);
            if(decryptedEmail === email){
                await this.userCacheService.updateUser(user);
                return this.decryptUserData(user);
            }
        }
        if(exception)
            throw new NotFoundException("User not found");
        else
            return null;
    }

    async createUser(username: string, email: string, password: string): Promise<UserEntity>{
        const userExists = await this.findByEmail(email, false);
        if(userExists)
            throw new ConflictException("Email already used");
        const passwordHash = await this.encryptionService.hash(password);
        const userSecret = this.encryptionService.generateSecret();
        const encryptedUserSecret = this.encryptionService.encryptSymmetric(userSecret, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.userSecretsEncryptionStrength);
        const encryptedUsername = this.encryptionService.encryptSymmetric(username, userSecret, this.usersEncryptionStrength);
        const encryptedEmail = this.encryptionService.encryptSymmetric(email, userSecret, this.usersEncryptionStrength);
        const emailSum = this.encryptionService.getSum(email).substring(0, 10);
        const user: UserEntity = await this.prismaService.user.create({
            data: {
                username: encryptedUsername,
                email: encryptedEmail,
                email_sum: emailSum,
                password: passwordHash,
                secret: encryptedUserSecret,
            },
        });
        await this.verificationCodeService.createCode(user, this.encryptionService.generateSecret());
        return this.decryptUserData(user);
    }

    async updateUsername(user: UserEntity, newUsername: string): Promise<UserEntity>{
        if(!await this.isUserExists(user.id))
            throw new NotFoundException("User not found");
        const encryptedUsername = this.encryptionService.encryptSymmetric(newUsername, user.secret, this.usersEncryptionStrength);
        const dbUser: UserEntity = await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                username: encryptedUsername
            }
        });
        if(!dbUser)
            throw new NotFoundException("User not found");
        user.username = newUsername;
        await this.userCacheService.updateUser(user);
        return user;
    }

    async updatePassword(user: UserEntity, oldPassword: string, newPassword: string): Promise<UserEntity>{
        if(await this.encryptionService.compareHash(user.password, oldPassword))
            return await this.setPassword(user, newPassword);
        throw new ForbiddenException("Wrong password");
    }

    async setPassword(user: UserEntity, newPassword: string): Promise<UserEntity>{
        if(!await this.isUserExists(user.id))
            throw new NotFoundException("User not found");
        const passwordHash = await this.encryptionService.hash(newPassword);
        const dbUser: UserEntity = await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                password: passwordHash
            }
        });
        if(!dbUser)
            throw new NotFoundException("User not found");
        user.password = passwordHash;
        await this.userCacheService.updateUser(user);
        return user;
    }

    async deleteUser(user: UserEntity): Promise<UserEntity>{
        if(!await this.isUserExists(user.id))
            throw new NotFoundException("User not found");
        const dbUser: UserEntity = await this.prismaService.user.delete({where: {id: user.id}});
        if(!dbUser)
            throw new NotFoundException("User not found");
        await this.userCacheService.deleteUser(user);
        return user;
    }

    async deleteUnverifiedUsers(): Promise<number>{
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
        const usersToDelete: UserEntity[] = [];
        for(const user of users)
            if(user.verification_codes)
                usersToDelete.push(user);
        const {count} = await this.prismaService.user.deleteMany({where: {id: {in: usersToDelete.map(user => user.id)}}});
        await this.userCacheService.deleteManyUsers(usersToDelete);
        return count;
    }

    async setUserSecret(tx: Prisma.TransactionClient, user: UserEntity, secret: string): Promise<UserEntity>{
        if(!await this.isUserExists(user.id))
            throw new NotFoundException("User not found");
        const encryptedSecret = this.encryptionService.encryptSymmetric(secret, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.userSecretsEncryptionStrength);
        const encryptedUsername = this.encryptionService.encryptSymmetric(user.username, secret, this.usersEncryptionStrength);
        const encryptedEmail = this.encryptionService.encryptSymmetric(user.email, secret, this.usersEncryptionStrength);
        const dbUser = await tx.user.update({
            where: {
                id: user.id
            },
            data: {
                username: encryptedUsername,
                secret: encryptedSecret,
                email: encryptedEmail,
            }
        });
        if(!dbUser)
            throw new NotFoundException("User not found");
        user.secret = secret;
        await this.userCacheService.updateUser(user);
        return user;
    }

    async countUsers(){
        const count = await this.prismaService.user.count();
        return {
            count: count,
        };
    }
}
