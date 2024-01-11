import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
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
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiResponse({status: HttpStatus.ACCEPTED, description: "Send password recovery email"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid or missing fields"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "User not found"})
    async recoverPassword(@Body() emailDto: EmailDto): Promise<void>{
        await this.passwordRecoveryService.sendRecoveryEmail(emailDto.email);
    }

    @Post("/reset")
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiResponse({status: HttpStatus.ACCEPTED, description: "Password reset successfully"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid or missing fields"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "No user found with this recovery code"})
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void>{
        await this.passwordRecoveryService.resetPassword(resetPasswordDto.recovery_code, resetPasswordDto.new_password);
    }
}
