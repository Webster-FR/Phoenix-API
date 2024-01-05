import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from "nodemailer";


@Injectable()
export class EmailService{

    constructor(
        private readonly configService: ConfigService,
    ){}

    async sendConfirmationEmail(email: string, code: string): Promise<void>{
        const emailUser = this.configService.get("EMAIL_USER");
        const emailPassword = this.configService.get("EMAIL_PASSWORD");
        const emailService = this.configService.get("EMAIL_SERVICE");
        const transporter = nodemailer.createTransport({
            service: emailService,
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        });
        const link = this.configService.get("VERIFICATION_LINK");
        const mailOptions = {
            from: emailUser,
            to: email,
            subject: "[Phoenix] Confirm your account",
            text: `Your confirmation code is ${link}/${code}`,
        };
        await transporter.sendMail(mailOptions);
    }
}
