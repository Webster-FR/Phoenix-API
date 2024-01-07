import {EncryptionService} from "../../src/services/encryption.service";

const encryptionService = new EncryptionService();
const todosEncryptionStrength = parseInt(process.env.TODOS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Test 1", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        frequency: null,
        icon: "none",
        color: "none",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        user_id: 1,
        name: encryptionService.encryptSymmetric("Test 2", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        parent_id: 1,
        frequency: null,
        icon: "none",
        color: "none",
        created_at: new Date(),
        updated_at: new Date(),
    }
];
