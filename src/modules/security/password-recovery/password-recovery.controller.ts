import {Body, Controller, Post} from "@nestjs/common";
import {PasswordRecoveryService} from "./password-recovery.service";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ResetPasswordDto} from "./models/dto/reset-password.dto";
import {EmailDto} from "./models/dto/email.dto";

@Controller("password")
@ApiTags("Password recovery")
export class PasswordRecoveryController{

    constructor(
        private readonly passwordRecoveryService: PasswordRecoveryService,
    ){}

    @Post("/reset/email")
    @ApiResponse({status: 204, description: "Send password recovery email"})
    @ApiResponse({status: 400, description: "Invalid or missing fields"})
    @ApiResponse({status: 404, description: "User not found"})
    async recoverPassword(@Body() emailDto: EmailDto): Promise<void>{
        await this.passwordRecoveryService.sendRecoveryEmail(emailDto.email);
    }

    @Post("/reset")
    @ApiResponse({status: 204, description: "Password reset successfully"})
    @ApiResponse({status: 400, description: "Invalid or missing fields"})
    @ApiResponse({status: 404, description: "No user found with this recovery code"})
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void>{
        await this.passwordRecoveryService.resetPassword(resetPasswordDto.recovery_code, resetPasswordDto.new_password);
    }
}
