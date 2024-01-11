import {UsersService} from "../security/users/users.service";
import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";


@Injectable()
export class UserCleanupTask{

    private readonly logger = new Logger(UserCleanupTask.name);

    constructor(
        private readonly usersService: UsersService,
    ){}

    @Cron("0 0 0 * * *")
    async handleCron(){
        this.logger.log("Running user cleanup task");
        const count = await this.usersService.deleteUnverifiedUsers();
        this.logger.log(`Deleted ${count} unverified users`);
    }
}
