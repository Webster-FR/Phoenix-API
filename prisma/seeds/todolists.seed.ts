import * as dotenv from "dotenv";
import {EncryptionService} from "../../src/common/services/encryption.service";

dotenv.config();

const encryptionService = new EncryptionService();
const todoListsEncryptionStrength = parseInt(process.env.TODO_LISTS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Phoenix Frontend", userSecret, todoListsEncryptionStrength),
        icon: "eye-slash",
        color: "blue",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Phoenix Backend", userSecret, todoListsEncryptionStrength),
        icon: "flask",
        color: "red",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Musics", userSecret, todoListsEncryptionStrength),
        icon: "shopping-bag",
        color: "yellow",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Home", userSecret, todoListsEncryptionStrength),
        icon: "flask",
        color: "green",
        created_at: new Date(),
        updated_at: new Date(),
    }
];
