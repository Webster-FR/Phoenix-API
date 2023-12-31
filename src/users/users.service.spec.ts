import {Test, TestingModule} from "@nestjs/testing";
import {UsersService} from "./users.service";
import {PrismaService} from "../services/prisma.service";

const userArray = [
    {
        id: 1,
        username: "test",
        password: "test",
        groupId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: 2,
        username: "admin",
        password: "admin",
        groupId: 2,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

const oneUser = userArray[0];

const db = {
    users: {
        findOne: jest.fn().mockResolvedValue(oneUser),
        findByUsername: jest.fn().mockResolvedValue(oneUser)
    }
};

describe("UsersService", () => {
    let service: UsersService;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, {
                provide: PrismaService,
                useValue: db
            }],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
