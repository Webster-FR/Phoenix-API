import {EncryptionService} from "../../src/services/encryption.service";

const encryptionService = new EncryptionService();
const accountsEncryptionStrength = parseInt(process.env.ACCOUNTS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        name: encryptionService.encryptSymmetric("User account 1", userSecret, accountsEncryptionStrength),
        amount: encryptionService.encryptSymmetric("350.38", userSecret, accountsEncryptionStrength),
        bank_id: 2,
        user_id: 1,
    },
    {
        name: encryptionService.encryptSymmetric("User account 2", userSecret, accountsEncryptionStrength),
        amount: encryptionService.encryptSymmetric("-125.75", userSecret, accountsEncryptionStrength),
        bank_id: 1,
        user_id: 1,
    }
];
