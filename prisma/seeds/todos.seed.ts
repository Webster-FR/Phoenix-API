import {EncryptionService} from "../../src/common/services/encryption.service";
import * as dotenv from "dotenv";

dotenv.config();

const encryptionService = new EncryptionService();
const todosEncryptionStrength = parseInt(process.env.TODOS_ENCRYPTION_STRENGTH);

export default (userSecret: string) => [
    {
        todo_list_id: 1,
        name: encryptionService.encryptSymmetric("Rework UI components", userSecret, todosEncryptionStrength),
        completed: true,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 1,
        name: encryptionService.encryptSymmetric("Rework todos components", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 1,
        name: encryptionService.encryptSymmetric("Rework todos UI", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 2,
        name: encryptionService.encryptSymmetric("Implement todo lists", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 2,
        name: encryptionService.encryptSymmetric("Rework todos", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 3,
        name: encryptionService.encryptSymmetric("Listen to Kool-Aid from Bring Me The Horizon", userSecret, todosEncryptionStrength),
        completed: true,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 4,
        name: encryptionService.encryptSymmetric("Do the dishes", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 4,
        name: encryptionService.encryptSymmetric("Make some cleaning", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        todo_list_id: 4,
        name: encryptionService.encryptSymmetric("Feed the dog", userSecret, todosEncryptionStrength),
        completed: false,
        deadline: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    }
];
