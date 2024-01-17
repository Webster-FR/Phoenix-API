import * as dotenv from "dotenv";
import {EncryptionService} from "../../src/common/services/encryption.service";

dotenv.config();

const encryptionService = new EncryptionService();
const todoListsEncryptionStrength = parseInt(process.env.TODO_LISTS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Phoenix Frontend", userSecret, todoListsEncryptionStrength),
        icon: "bulb",
        color: "lollipop",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Phoenix Backend", userSecret, todoListsEncryptionStrength),
        icon: "trash",
        color: "ocean",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Musics", userSecret, todoListsEncryptionStrength),
        icon: "play-btn",
        color: "rocket",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Home", userSecret, todoListsEncryptionStrength),
        icon: "home",
        color: "sky",
        created_at: new Date(),
        updated_at: new Date(),
    }
];
