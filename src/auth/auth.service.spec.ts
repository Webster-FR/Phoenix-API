import {Test, TestingModule} from "@nestjs/testing";
import {AuthService} from "./auth.service";
import {PrismaService} from "../services/prisma.service";
import {EncryptionService} from "../services/encryption.service";

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, PrismaService, EncryptionService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
