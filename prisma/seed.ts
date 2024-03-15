// noinspection TypeScriptValidateJSTypes

import {PrismaClient} from "@prisma/client";
import {CipherService} from "../src/common/services/cipher.service";
import * as dotenv from "dotenv";
import tips from "./seeds/tips.seed";
import usersFunction from "./seeds/users.seed";
import todoListsFunction from "./seeds/todolists.seed";
import todosFunction from "./seeds/tasks.seed";

dotenv.config();

// initialize Prisma Client
const prisma = new PrismaClient();
const encryptionService = new CipherService();

async function main(){
    const userSecret = encryptionService.generateSecret();

    const gStart = Date.now();

    let start = Date.now();
    const users = await usersFunction(userSecret);
    await seed(prisma.users, users);
    console.log("✅  User seed done ! (" + (Date.now() - start) + "ms)");

    start = Date.now();
    const todoLists = todoListsFunction(userSecret);
    await seed(prisma.todoLists, todoLists);
    console.log("✅  Todo list seed done ! (" + (Date.now() - start) + "ms)");

    start = Date.now();
    const todos = todosFunction(userSecret);
    await seed(prisma.tasks, todos);
    console.log("✅  Todo seed done ! (" + (Date.now() - start) + "ms)");

    start = Date.now();
    await seed(prisma.tips, tips);
    console.log("✅  Tip seed done ! (" + (Date.now() - start) + "ms)");

    console.log(`\n✅  Seeding completed ! (${Date.now() - gStart}ms)`);
}

async function seed(table: any, data: any[]){
    for(let i = 1; i <= data.length; i++){
        await table.upsert({
            where: {id: i},
            update: {
                ...data[i - 1],
            },
            create: {
                ...data[i - 1],
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
