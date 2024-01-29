import {TokensService} from "../../modules/security/auth/tokens.service";
import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";


@Injectable()
export class TokenCleanupCron{

    private readonly logger = new Logger(TokenCleanupCron.name);

    constructor(
        private readonly tokensService: TokensService,
    ){}

    @Cron("0 0 0 * * *")
    async handleCron(){
        this.logger.log("Cleaning up expired tokens...");
        const count = await this.tokensService.deleteExpiredTokens();
        this.logger.log(`Deleted ${count} expired tokens`);
    }
}
