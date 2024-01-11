import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from "nodemailer";


@Injectable()
export class EmailService{

    constructor(
        private readonly configService: ConfigService,
    ){}

    async sendMail(email: string, subject: string, content: string){
        const emailUser = this.configService.get("EMAIL_USER");
        const emailPassword = this.configService.get("EMAIL_PASSWORD");
        const emailHost = this.configService.get("EMAIL_HOST");
        const emailPort = this.configService.get<number>("EMAIL_PORT");
        const transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPort,
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        });
        const mailOptions = {
            from: emailUser,
            to: email,
            subject: subject,
            text: content,
        };
        await transporter.sendMail(mailOptions);
    }

    async sendConfirmationEmail(email: string, code: string): Promise<void>{
        const link = this.configService.get("VERIFICATION_LINK");
        await this.sendMail(email, "[Phoenix] Confirm your account", `Your confirmation link is ${link}${code}`);
    }

    async sendPasswordRecoveryEmail(email: string, code: string): Promise<void>{
        const link = this.configService.get("PASSWORD_RECOVERY_LINK");
        await this.sendMail(email, "[Phoenix] Reset your password", `Your password recovery link is ${link}${code}`);
    }
}
