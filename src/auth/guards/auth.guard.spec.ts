import {Test} from "@nestjs/testing";
import {AuthGuard} from "./auth.guard";
import {EncryptionService} from "../../services/encryption.service";
import {UsersService} from "../../users/users.service";
import {PrismaService} from "../../services/prisma.service";

describe("AuthGuard", () => {
    let authGuard: AuthGuard;

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [AuthGuard, EncryptionService, UsersService, PrismaService],
        }).compile();

        authGuard = moduleRef.get<AuthGuard>(AuthGuard);
    });

    it("should be defined", () => {
        expect(authGuard).toBeDefined();
    });
});
