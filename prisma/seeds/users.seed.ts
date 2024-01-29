import {CipherService} from "../../src/common/services/cipher.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new CipherService();
const encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY;
const userSecretsEncryptionStrength = parseInt(process.env.USER_SECRETS_ENCRYPTION_STRENGTH);
const usersEncryptionStrength = parseInt(process.env.USERS_ENCRYPTION_STRENGTH);

export default async(userSecret: string) => [
    {
        username: encryptionService.cipherSymmetric("test", userSecret, usersEncryptionStrength),
        password: await encryptionService.hash("wtviE6AZ!Ypf52pMetSR"),
        email: encryptionService.cipherSymmetric("test@example.org", userSecret, usersEncryptionStrength),
        email_sum: encryptionService.getSum("test@example.org").substring(0, 10),
        secret: encryptionService.cipherSymmetric(userSecret, encryptionKey, userSecretsEncryptionStrength),
        created_at: new Date(),
        updated_at: new Date(),
    }
];
