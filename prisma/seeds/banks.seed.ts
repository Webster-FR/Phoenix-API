import {EncryptionService} from "../../src/services/encryption.service";

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
