import {Injectable} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {AccountEntity} from "./models/entities/account.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../services/encryption.service";

@Injectable()
export class AccountsService{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
    ){}

    async getAccounts(userId: number): Promise<AccountEntity[]>{
        const user = await this.usersService.findById(userId);
        const accounts: AccountEntity[] = await this.prismaService.accounts.findMany({
            where: {
                user_id: userId,
            }
        });
        for(const account of accounts)
            account.name = this.encryptionService.decryptSymmetric(account.name, user.secret);
        return accounts;
    }
}
