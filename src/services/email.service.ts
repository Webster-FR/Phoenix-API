import {Injectable} from "@nestjs/common";


@Injectable()
export class EmailService{
    async sendConfirmationEmail(email: string, code: string): Promise<void>{
        throw new Error("Not implemented");
    }
}
