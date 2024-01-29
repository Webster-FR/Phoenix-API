import * as dotenv from "dotenv";
import {CipherService} from "../../src/common/services/cipher.service";

dotenv.config();

const encryptionService = new CipherService();
const todoListsEncryptionStrength = parseInt(process.env.TODO_LISTS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        user_id: 1,
        name: encryptionService.cipherSymmetric("Phoenix Frontend", userSecret, todoListsEncryptionStrength),
        icon: "bulb",
        color: "lollipop",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.cipherSymmetric("Phoenix Backend", userSecret, todoListsEncryptionStrength),
        icon: "trash",
        color: "ocean",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.cipherSymmetric("Musics", userSecret, todoListsEncryptionStrength),
        icon: "play-btn",
        color: "rocket",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.cipherSymmetric("Home", userSecret, todoListsEncryptionStrength),
        icon: "home",
        color: "sky",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.cipherSymmetric("Random", userSecret, todoListsEncryptionStrength),
        icon: "cart",
        color: "berry",
        created_at: new Date(),
        updated_at: new Date(),
    }
];
