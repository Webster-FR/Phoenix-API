// noinspection TypeScriptValidateJSTypes

import {PrismaClient} from "@prisma/client";
import {EncryptionService} from "../src/services/encryption.service";
import * as dotenv from "dotenv";
import {getTipsSeed} from "./seeds/tips.seed";

dotenv.config();

// initialize Prisma Client
const prisma = new PrismaClient();
const encryptionService = new EncryptionService();

async function main(){
    const userSecret = encryptionService.generateSecret();
    const encryptionKey = process.env.SYMMETRIC_ENCRYPTION_KEY;
    const userSecretsEncryptionStrength = parseInt(process.env.USER_SECRETS_ENCRYPTION_STRENGTH);
    const usersEncryptionStrength = parseInt(process.env.USERS_ENCRYPTION_STRENGTH);
    const banksEncryptionStrength = parseInt(process.env.BANKS_ENCRYPTION_STRENGTH);
    const ledgersEncryptionStrength = parseInt(process.env.LEDGERS_ENCRYPTION_STRENGTH);
    const recurringTransactionsEncryptionStrength = parseInt(process.env.RECURRING_TRANSACTIONS_ENCRYPTION_STRENGTH);
    const accountsEncryptionStrength = parseInt(process.env.ACCOUNTS_ENCRYPTION_STRENGTH);
    const todosEncryptionStrength = parseInt(process.env.TODOS_ENCRYPTION_STRENGTH);
    const transactionCategoriesEncryptionStrength = parseInt(process.env.TRANSACTION_CATEGORIES_ENCRYPTION_STRENGTH);
    const testUser = await prisma.user.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            username: encryptionService.encryptSymmetric("test", userSecret, usersEncryptionStrength),
            email: "test@exemple.org",
            password: await encryptionService.hash("password"),
            secret: encryptionService.encryptSymmetric(userSecret, encryptionKey, userSecretsEncryptionStrength),
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
            name: encryptionService.encryptSymmetric("Test 1", userSecret, todosEncryptionStrength),
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
            name: encryptionService.encryptSymmetric("Test 2", userSecret, todosEncryptionStrength),
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

    const tipsSeed = await getTipsSeed();
    const tips = [];
    for (let i = 0; i < tipsSeed.length; i++){
        tips.push(await prisma.tips.upsert({
            where: {id: i + 1},
            update: {},
            create: {
                id: i + 1,
                tips: tipsSeed[i].tips,
                author: tipsSeed[i].author || null,
                order: i + 1,
            },
        }));
    }

    const defaultBank = await prisma.banks.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            name: encryptionService.encryptSymmetric("Default bank", encryptionKey, banksEncryptionStrength),
        },
    });

    const userBank = await prisma.banks.upsert({
        where: {id: 2},
        update: {},
        create: {
            id: 2,
            user_id: 1,
            name: encryptionService.encryptSymmetric("User bank", encryptionKey, banksEncryptionStrength),
        },
    });

    const userAccount = await prisma.accounts.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            name: encryptionService.encryptSymmetric("User account", userSecret, accountsEncryptionStrength),
            amount: encryptionService.encryptSymmetric("0", userSecret, accountsEncryptionStrength),
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
            wording: encryptionService.encryptSymmetric("Test", userSecret, recurringTransactionsEncryptionStrength),
            type: "expense",
            amount: encryptionService.encryptSymmetric("10", userSecret, recurringTransactionsEncryptionStrength),
            next_occurrence: new Date(),
            frequency: "monthly",
            from_account_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    const ledger1 = await prisma.internalLedger.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            account_id: 1,
            credit: encryptionService.encryptSymmetric("100", userSecret, ledgersEncryptionStrength),
            debit: null,
            created_at: new Date(),
        },
    });

    const ledger2 = await prisma.internalLedger.upsert({
        where: {id: 2},
        update: {},
        create: {
            id: 2,
            account_id: 1,
            credit: null,
            debit: encryptionService.encryptSymmetric("100", userSecret, ledgersEncryptionStrength),
            created_at: new Date(),
        },
    });

    const defaultTransactionCategory = await prisma.transactionCategories.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            user_id: null,
            name: encryptionService.encryptSymmetric("Default transaction category", encryptionKey, transactionCategoriesEncryptionStrength),
            icon: "none",
            color: "none",
        },
    });

    const transactionCategory = await prisma.transactionCategories.upsert({
        where: {id: 2},
        update: {},
        create: {
            id: 2,
            user_id: 1,
            name: encryptionService.encryptSymmetric("User transaction category", encryptionKey, transactionCategoriesEncryptionStrength),
            icon: "none",
            color: "none",
        },
    });

    console.log(
        testUser,
        test1Todos,
        test2Todos,
        tips,
        defaultBank,
        userBank,
        userAccount,
        recurringTransaction,
        ledger1,
        ledger2,
        defaultTransactionCategory,
        transactionCategory
    );
    console.log("Seeding done !");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async() => {
    await prisma.$disconnect();
});
