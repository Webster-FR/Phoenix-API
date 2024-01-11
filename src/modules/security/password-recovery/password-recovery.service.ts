/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable} from "@nestjs/common";

@Injectable()
export class PasswordRecoveryService{
    async sendRecoveryEmail(email: string){

    }

    async resetPassword(code: string, password: string){

    }
}
