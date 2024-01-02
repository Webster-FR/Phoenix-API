import {Injectable} from "@nestjs/common";


@Injectable()
export class EmailService{
    async sendConfirmationEmail(email: string, code: string): Promise<void>{
        console.log("Sending confirmation email to", email, "with code", code);
        throw new Error("Not implemented");
    }
}
