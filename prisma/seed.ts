// noinspection TypeScriptValidateJSTypes

import {PrismaClient} from "@prisma/client";
import {EncryptionService} from "../src/services/encryption.service";
import * as dotenv from "dotenv";
import tips from "./seeds/tips.seed";
import usersFunction from "./seeds/users.seed";
import todosFunction from "./seeds/todos.seed";
import banks from "./seeds/banks.seed";
import accountsFunction from "./seeds/accounts.seed";
import recurringTransactionsFunction from "./seeds/recurring-transactions.seed";
import transactionCategories from "./seeds/transaction-categories.seed";
import ledgersFunction from "./seeds/ledgers.seed";
import {
    incomeTransactionsFunction,
    expenseTransactionsFunction,
    internalTransactionsFunction
} from "./seeds/transactions.seed";

dotenv.config();

// initialize Prisma Client
const prisma = new PrismaClient();
const encryptionService = new EncryptionService();

async function main(){
    const userSecret = encryptionService.generateSecret();

    const users = await usersFunction(userSecret);
    await seed(prisma.user, users);

    const todos = todosFunction(userSecret);
    await seed(prisma.todos, todos);

    await seed(prisma.tips, tips);

    await seed(prisma.banks, banks);

    const accounts = accountsFunction(userSecret);
    await seed(prisma.accounts, accounts);

    const recurringTransactions = recurringTransactionsFunction(userSecret);
    await seed(prisma.recurringTransaction, recurringTransactions);

    await seed(prisma.transactionCategories, transactionCategories);

    const ledgers = ledgersFunction(userSecret);
    await seed(prisma.internalLedger, ledgers);

    const incomeTransactions = incomeTransactionsFunction(userSecret);
    await seedTransactions(prisma.incomeTransactions, incomeTransactions, false);
    const expenseTransactions = expenseTransactionsFunction(userSecret);
    await seedTransactions(prisma.expenseTransactions, expenseTransactions, false);
    const internalTransactions = internalTransactionsFunction(userSecret);
    await seedTransactions(prisma.internalTransactions, internalTransactions, true);

    console.log(
        users,
        todos,
        tips,
        banks,
        accounts,
        recurringTransactions,
        transactionCategories,
        ledgers,
        incomeTransactions,
        expenseTransactions,
        internalTransactions
    );
    console.log("Seeding done !");
}

async function seed(table: any, data: any[]){
    for(let i = 1; i <= data.length; i++){
        await table.upsert({
            where: {id: i},
            update: {},
            create: {
                id: i,
                ...data[i - 1],
            },
        });
    }
}

async function seedTransactions(table: any, data: any[], isInternal: boolean){
    if(!isInternal)
        for(let i = 1; i <= 24; i++){
            if(data.find((d) => d.internal_ledger_id === i))
                await table.upsert({
                    where: {internal_ledger_id: i},
                    update: {},
                    create: {
                        ...data.find((d) => d.internal_ledger_id === i),
                    },
                });
        }
    else
        for(let i = 1; i <= 24; i++){
            if(data.find((d) => d.debit_internal_ledger_id === i))
                await table.upsert({
                    where: {debit_internal_ledger_id: i},
                    update: {},
                    create: {
                        ...data.find((d) => d.debit_internal_ledger_id === i),
                    },
                });
        }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async() => {
    await prisma.$disconnect();
});
