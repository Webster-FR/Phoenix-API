import {Injectable, NotFoundException} from "@nestjs/common";
import {BankEntity} from "./models/entities/bank.entity";
import {PrismaService} from "../services/prisma.service";
import {ConfigService} from "@nestjs/config";
import {EncryptionService} from "../services/encryption.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class BanksService{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
        private readonly usersService: UsersService,
    ){}

    async getBanks(userId: number): Promise<BankEntity[]>{
        if(!await this.usersService.isUserExists(userId))
            throw new NotFoundException("User not found");
        const banks: BankEntity[] = await this.prismaService.banks.findMany({
            where: {
                OR: [
                    {user_id: userId},
                    {user_id: null},
                ],
            }
        });
        for(const bank of banks)
            bank.name = this.encryptionService.decryptSymmetric(bank.name, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"));
        return banks;
    }

    async addBank(userId: number, bankName: string): Promise<BankEntity>{
        if(!await this.usersService.isUserExists(userId))
            throw new NotFoundException("User not found");
        const banks = await this.getBanks(userId);
        for(const bank of banks)
            if(bank.name === bankName)
                throw new NotFoundException("Bank already exists");
        const bank: BankEntity = await this.prismaService.banks.create({
            data: {
                user_id: userId,
                name: this.encryptionService.encryptSymmetric(bankName, this.configService.get("SYMMETRIC_ENCRYPTION_KEY")),
            }
        });
        bank.name = bankName;
        return bank;
    }
}
