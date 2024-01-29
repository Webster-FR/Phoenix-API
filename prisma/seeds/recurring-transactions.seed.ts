import {CipherService} from "../../src/common/services/cipher.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new CipherService();
const recurringTransactionsEncryptionStrength = parseInt(process.env.RECURRING_TRANSACTIONS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        user_id: 1,
        wording: encryptionService.cipherSymmetric("Test", userSecret, recurringTransactionsEncryptionStrength),
        type: "expense",
        amount: encryptionService.cipherSymmetric("10", userSecret, recurringTransactionsEncryptionStrength),
        next_occurrence: new Date(),
        frequency: "monthly",
        from_account_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
    }
];
