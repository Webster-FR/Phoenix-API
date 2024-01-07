import {EncryptionService} from "../../src/services/encryption.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new EncryptionService();
const encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY;
const banksEncryptionStrength = parseInt(process.env.BANKS_ENCRYPTION_STRENGTH);

export default [
    {
        name: encryptionService.encryptSymmetric("Default bank", encryptionKey, banksEncryptionStrength),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("User bank", encryptionKey, banksEncryptionStrength),
    }
];
