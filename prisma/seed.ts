// noinspection TypeScriptValidateJSTypes

import {PrismaClient} from "@prisma/client";
import {EncryptionService} from "../src/services/encryption.service";

// initialize Prisma Client
const prisma = new PrismaClient();
const encryptionService = new EncryptionService();

async function main(){
    const testUser = await prisma.user.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            username: "test",
            email: "test@exemple.org",
            password: await encryptionService.hash("password"),
            secret: encryptionService.generateSecret(),
            verification_code_id: null,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    const test1Todos = await prisma.todos.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            user_id: 1,
            name: "Test 1",
            completed: false,
            deadline: new Date(),
            frequency: null,
            icon: "none",
            color: "none",
            created_at: new Date(),
            updated_at: new Date(),
        },
    });
    const test2Todos = await prisma.todos.upsert({
        where: {id: 2},
        update: {},
        create: {
            id: 2,
            user_id: 1,
            name: "Test 2",
            completed: false,
            deadline: new Date(),
            parent_id: 1,
            frequency: null,
            icon: "none",
            color: "none",
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    const tips = [];
    for (let i = 1; i <= 31; i++){
        tips.push(await prisma.tips.upsert({
            where: {id: i},
            update: {},
            create: {
                id: i,
                tips: `Tip ${i}`,
                order: i,
            },
        }));
    }

    const defaultBank = await prisma.banks.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            name: "Default bank",
        },
    });

    const userBank = await prisma.banks.upsert({
        where: {id: 2},
        update: {},
        create: {
            id: 2,
            user_id: 1,
            name: "User bank",
        },
    });

    const userAccount = await prisma.accounts.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            name: "User account",
            amount: 0,
            bank_id: 2,
            user_id: 1,
        },
    });

    const recurringTransaction = await prisma.recurringTransaction.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            user_id: 1,
            wording: "Test",
            type: "expense",
            amount: 10,
            next_occurrence: new Date(),
            frequency: "monthly",
            from_account_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    console.log(testUser, test1Todos, test2Todos, tips, defaultBank, userBank, userAccount, recurringTransaction);
    console.log("Seeding done !");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async() => {
    await prisma.$disconnect();
});
