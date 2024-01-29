import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {BankEntity} from "./models/entities/bank.entity";
import {PrismaService} from "../../../common/services/prisma.service";
import {ConfigService} from "@nestjs/config";
import {CipherService} from "../../../common/services/cipher.service";
import {UserEntity} from "../../security/users/models/entities/user.entity";
import {BankCacheService} from "../../cache/bank-cache.service";

@Injectable()
export class BanksService{

    private readonly banksEncryptionStrength = parseInt(this.configService.get("BANKS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly encryptionService: CipherService,
        private readonly bankCacheService: BankCacheService
    ){}

    async getBanks(user: UserEntity): Promise<BankEntity[]>{
        let banks = await this.bankCacheService.getBanks(user);
        if(banks)
            return banks;
        banks = await this.prismaService.banks.findMany({
            where: {
                OR: [
                    {user_id: user.id},
                    {user_id: null},
                ],
            }
        });
        for(const bank of banks)
            bank.name = this.encryptionService.decipherSymmetric(bank.name, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength);
        await this.bankCacheService.setBanks(user, banks);
        return banks;
    }

    async findOne(user: UserEntity, bankId: number): Promise<BankEntity>{
        let bank = await this.bankCacheService.getBank(user, bankId);
        if(bank)
            return bank;
        bank = await this.prismaService.banks.findUnique({
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
        bank.name = this.encryptionService.decipherSymmetric(bank.name, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength);
        return bank;
    }

    async addBank(user: UserEntity, bankName: string): Promise<BankEntity>{
        let banks = await this.bankCacheService.getBanks(user);
        if(!banks)
            banks = await this.getBanks(user);
        for(const bank of banks)
            if(bank.name === bankName)
                throw new ConflictException("Bank already exists whit this name");
        const bank: BankEntity = await this.prismaService.banks.create({
            data: {
                user_id: user.id,
                name: this.encryptionService.cipherSymmetric(bankName, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength),
            }
        });
        bank.name = bankName;
        await this.bankCacheService.addBank(user, bank);
        return bank;
    }

    async updateBankName(user: UserEntity, bankId: number, name: string): Promise<BankEntity>{
        let banks = await this.bankCacheService.getBanks(user);
        if(!banks)
            banks = await this.getBanks(user);
        for(const bank of banks)
            if(bank.name === name)
                throw new ConflictException("Bank already exists with this name");
        // Check if bank exists
        let bank: BankEntity = await this.prismaService.banks.findUnique({
            where: {
                id: bankId,
                user_id: user.id,
            }
        });
        if(!bank)
            throw new NotFoundException("User bank not found");
        // Update bank name
        bank = await this.prismaService.banks.update({
            where: {
                id: bankId,
                user_id: user.id,
            },
            data: {
                name: this.encryptionService.cipherSymmetric(name, this.configService.get("SYMMETRIC_ENCRYPTION_KEY"), this.banksEncryptionStrength),
            }
        });
        bank.name = name;
        await this.bankCacheService.updateBank(user, bank);
        return bank;
    }

    async deleteBank(user: UserEntity, bankId: number): Promise<void>{
        // Check if bank exists
        const bank: BankEntity = await this.prismaService.banks.findUnique({
            where: {
                id: bankId,
                user_id: user.id,
            }
        });
        if(!bank)
            throw new NotFoundException("User bank not found");
        // Delete bank
        await this.prismaService.banks.delete({
            where: {
                id: bankId,
                user_id: user.id,
            }
        });
        await this.bankCacheService.deleteBank(user, bank);
    }
}
