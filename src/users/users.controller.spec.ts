import {Test, TestingModule} from "@nestjs/testing";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {UserEntity} from "./entities/user.entity";
import {EncryptionService} from "../services/encryption.service";

describe("UsersController", () => {
    let controller: UsersController;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [EncryptionService, {
                provide: UsersService,
                useValue: {
                    findSelf: jest.fn<Promise<UserEntity>, []>().mockImplementation(() => {
                        return Promise.resolve({
                            id: 1,
                            username: "test",
                            password: "test",
                            groupId: 1,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }),
                }
            }],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
