import {Test, TestingModule} from "@nestjs/testing";
import {TotpService} from "./totp.service";

describe("ServicesService", () => {
    let service: TotpService;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TotpService],
        }).compile();

        service = module.get<TotpService>(TotpService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("generateTotpQrCode", () => {
        it("should return a string", async() => {
            const result = await service.generateTotpQrCode("user", "issuer", "secret");
            expect(typeof result).toBe("string");
        });

        it("should throw an error if invalid parameters are passed", () => {
            expect(() => service.generateTotpQrCode("", "", "")).toThrow("Invalid parameters");
        });
    });

    describe("verifyTOTP", () => {
        it("should return a boolean", () => {
            const result = service.verifyTOTP("secret", "token");
            expect(typeof result).toBe("boolean");
        });

        it("should return false if the token is invalid", () => {
            const result = service.verifyTOTP("secret", "invalid token");
            expect(result).toBe(false);
        });
    });
});
