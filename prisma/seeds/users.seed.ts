import {EncryptionService} from "../../src/common/services/encryption.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new EncryptionService();
const encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY;
const userSecretsEncryptionStrength = parseInt(process.env.USER_SECRETS_ENCRYPTION_STRENGTH);
const usersEncryptionStrength = parseInt(process.env.USERS_ENCRYPTION_STRENGTH);

export default async(userSecret: string) => [
    {
        username: encryptionService.encryptSymmetric("test", userSecret, usersEncryptionStrength),
        email: "test@exemple.org",
        password: await encryptionService.hash("wtviE6AZ!Ypf52pMetSR"),
        secret: encryptionService.encryptSymmetric(userSecret, encryptionKey, userSecretsEncryptionStrength),
        created_at: new Date(),
        updated_at: new Date(),
    }
];
