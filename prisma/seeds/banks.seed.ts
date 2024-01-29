import {CipherService} from "../../src/common/services/cipher.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new CipherService();
const encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY;
const banksEncryptionStrength = parseInt(process.env.BANKS_ENCRYPTION_STRENGTH);

export default [
    {
        name: encryptionService.cipherSymmetric("Default bank", encryptionKey, banksEncryptionStrength),
    },
    {
        user_id: 1,
        name: encryptionService.cipherSymmetric("User bank", encryptionKey, banksEncryptionStrength),
    }
];
