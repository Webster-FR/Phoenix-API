import {CipherService} from "../../src/common/services/cipher.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new CipherService();
const encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY;
const transactionCategoriesEncryptionStrength = parseInt(process.env.TRANSACTION_CATEGORIES_ENCRYPTION_STRENGTH);

export default [
    {
        user_id: null,
        name: encryptionService.cipherSymmetric("Default transaction category", encryptionKey, transactionCategoriesEncryptionStrength),
        icon: "none",
        color: "none",
    },
    {
        user_id: 1,
        name: encryptionService.cipherSymmetric("User transaction category", encryptionKey, transactionCategoriesEncryptionStrength),
        icon: "none",
        color: "none",
    }
];
