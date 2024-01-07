import {EncryptionService} from "../../src/services/encryption.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new EncryptionService();
const recurringTransactionsEncryptionStrength = parseInt(process.env.RECURRING_TRANSACTIONS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        user_id: 1,
        wording: encryptionService.encryptSymmetric("Test", userSecret, recurringTransactionsEncryptionStrength),
        type: "expense",
        amount: encryptionService.encryptSymmetric("10", userSecret, recurringTransactionsEncryptionStrength),
        next_occurrence: new Date(),
        frequency: "monthly",
        from_account_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
    }
];
