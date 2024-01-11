import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {BankEntity} from "./models/entities/bank.entity";
import {PrismaService} from "../../../common/services/prisma.service";
import {ConfigService} from "@nestjs/config";
import {EncryptionService} from "../../../common/services/encryption.service";
import {UsersService} from "../../security/users/users.service";
import {UserEntity} from "../../security/users/models/entities/user.entity";

@Injectable()
export class BanksService{

    private readonly banksEncryptionStrength = parseInt(this.configService.get("BANKS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
        private readonly usersService: UsersService,
    ){}

    async getBanks(user: UserEntity): Promise<BankEntity[]>{
        const banks: BankEntity[] = await this.prismaService.banks.findMany({
            where: {
                OR: [
                    {user_id: user.id},
                    {user_id: null},
                ],
            }
        });
        for(const bank of banks)
            bank.name = this.encryptionService.decryptSymmetric(bank.name, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength);
        return banks;
    }

    async findOne(user: UserEntity, bankId: number): Promise<BankEntity>{
        const bank: BankEntity = await this.prismaService.banks.findUnique({
            where: {
                id: bankId,
                OR: [
                    {user_id: user.id},
                    {user_id: null},
                ],
            }
        });
        if(!bank)
            throw new NotFoundException("User bank not found");
        bank.name = this.encryptionService.decryptSymmetric(bank.name, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength);
        return bank;
    }

    async addBank(user: UserEntity, bankName: string): Promise<BankEntity>{
        const banks = await this.getBanks(user);
        for(const bank of banks)
            if(bank.name === bankName)
                throw new NotFoundException("Bank already exists");
        const bank: BankEntity = await this.prismaService.banks.create({
            data: {
                user_id: user.id,
                name: this.encryptionService.encryptSymmetric(bankName, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength),
            }
        });
        bank.name = bankName;
        return bank;
    }

    async updateBankName(user: UserEntity, bankId: number, name: string): Promise<BankEntity>{
        const banks = await this.getBanks(user);
        for(const bank of banks)
            if(bank.name === name)
                throw new ConflictException("Bank already exists with this name");
        const bank: BankEntity = await this.prismaService.banks.update({
            where: {
                id: bankId,
                user_id: user.id,
            },
            data: {
                name: this.encryptionService.encryptSymmetric(name, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength),
            }
        });
        if(!bank)
            throw new NotFoundException("User bank not found");
        bank.name = name;
        return bank;
    }

    async deleteBank(user: UserEntity, bankId: number): Promise<void>{
        const bank: BankEntity = await this.prismaService.banks.delete({
            where: {
                id: bankId,
                user_id: user.id,
            }
        });
        if(!bank)
            throw new NotFoundException("User bank not found");
    }
}
