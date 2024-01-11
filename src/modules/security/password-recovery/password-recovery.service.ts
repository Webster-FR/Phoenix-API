/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {EmailService} from "../../../common/services/email.service";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class PasswordRecoveryService{

    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly authService: AuthService,

    ){
    }

    async sendRecoveryEmail(email: string){

    }

    async resetPassword(code: string, password: string){

    }
}
