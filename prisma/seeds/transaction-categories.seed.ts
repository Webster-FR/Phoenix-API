import {EncryptionService} from "../../src/services/encryption.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new EncryptionService();
const encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY;
const transactionCategoriesEncryptionStrength = parseInt(process.env.TRANSACTION_CATEGORIES_ENCRYPTION_STRENGTH);

export default [
    {
        user_id: null,
        name: encryptionService.encryptSymmetric("Default transaction category", encryptionKey, transactionCategoriesEncryptionStrength),
        icon: "none",
        color: "none",
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("User transaction category", encryptionKey, transactionCategoriesEncryptionStrength),
        icon: "none",
        color: "none",
    }
];
