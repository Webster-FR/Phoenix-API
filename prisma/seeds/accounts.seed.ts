import {CipherService} from "../../src/common/services/cipher.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new CipherService();
const accountsEncryptionStrength = parseInt(process.env.ACCOUNTS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        name: encryptionService.cipherSymmetric("User account 1", userSecret, accountsEncryptionStrength),
        amount: encryptionService.cipherSymmetric("350.38", userSecret, accountsEncryptionStrength),
        bank_id: 2,
        user_id: 1,
    },
    {
        name: encryptionService.cipherSymmetric("User account 2", userSecret, accountsEncryptionStrength),
        amount: encryptionService.cipherSymmetric("-125.75", userSecret, accountsEncryptionStrength),
        bank_id: 1,
        user_id: 1,
    }
];
