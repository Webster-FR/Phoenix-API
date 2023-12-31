import {Test, TestingModule} from "@nestjs/testing";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UsersModule} from "../users/users.module";
import {PrismaService} from "../services/prisma.service";
import {EncryptionService} from "../services/encryption.service";

describe("AuthController", () => {
    let controller: AuthController;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, PrismaService, EncryptionService],
            imports: [UsersModule],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
