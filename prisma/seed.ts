import {PrismaClient} from "@prisma/client";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main(){
    const defaultGroup = await prisma.group.upsert({
        where: {name: "default"},
        update: {},
        create: {
            name: "default",
        },
    });

    const adminGroup = await prisma.group.upsert({
        where: {name: "admin"},
        update: {},
        create: {
            name: "admin",
        },
    });

    const admin = await prisma.user.upsert({
        where: {username: "admin"},
        update: {},
        create: {
            username: "admin",
            password: "$argon2id$v=19$m=12,t=10,p=1$emxtN2RndHBvenAwMDAwMA$Ecz+bRSpVdiq9BMMJbOfAw",
            group_id: adminGroup.id,
        },
    });

    console.log({defaultGroup, adminGroup, admin});
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async() => {
    await prisma.$disconnect();
});
