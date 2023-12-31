import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {ApiBasicAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AtGuard} from "./guards/at.guard";
import {RegisterDto} from "./dto/register.dto";
import {RegisterResponse} from "./models/register.response";
import {LoginDto} from "./dto/login.dto";
import {LoginResponse} from "./models/login.response";
import {RtGuard} from "./guards/rt.guard";
import {CtGuard} from "./guards/ct.guard";
import {ConfirmAccountResponse} from "./models/confirm-account.response";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController{
    constructor(){}

    @Post("login")
    @ApiResponse({status: 200, description: "User logged in successfully", type: LoginResponse})
    @ApiResponse({status: 400, description: "Missing required fields"})
    @ApiResponse({status: 401, description: "Invalid password"})
    @ApiResponse({status: 403, description: "Account not confirmed", type: RegisterResponse})
    @ApiResponse({status: 404, description: "Email not found"})
    login(@Body() loginDto: LoginDto): LoginResponse | RegisterResponse{
        throw new Error("Not implemented");
    }

    @Post("logout")
    @UseGuards(AtGuard)
    @ApiBasicAuth()
    @ApiResponse({status: 200, description: "All tokens invalidated"})
    @ApiResponse({status: 401, description: "Invalid access token"})
    logout(){
        throw new Error("Not implemented");
    }

    @Post("logout/all")
    @UseGuards(AtGuard)
    @ApiBasicAuth()
    @ApiResponse({status: 200, description: "All tokens invalidated"})
    @ApiResponse({status: 401, description: "Invalid access token"})
    logoutAll(){
        throw new Error("Not implemented");
    }

    @Post("register")
    @ApiResponse({status: 201, description: "User registered successfully", type: RegisterResponse})
    @ApiResponse({status: 400, description: "Missing required fields or password too weak"})
    @ApiResponse({status: 409, description: "Email already exists"})
    register(@Body() registerDto: RegisterDto): RegisterResponse{
        throw new Error("Not implemented");
    }

    @Post("refresh")
    @UseGuards(RtGuard)
    @ApiBasicAuth()
    @ApiResponse({status: 200, description: "Token refreshed successfully", type: LoginResponse})
    @ApiResponse({status: 401, description: "Invalid refresh token"})
    @ApiResponse({status: 409, description: "Refresh token already used"})
    refresh(): LoginResponse{
        throw new Error("Not implemented");
    }

    @Post("register/confirm")
    @UseGuards(CtGuard)
    @ApiBasicAuth()
    @ApiResponse({status: 200, description: "Account confirmed successfully", type: ConfirmAccountResponse})
    @ApiResponse({status: 401, description: "Invalid confirmation token"})
    confirmAccount(): ConfirmAccountResponse{
        throw new Error("Not implemented");
    }

    @Post("register/confirm/resend")
    @UseGuards(CtGuard)
    @ApiBasicAuth()
    resendConfirmationCode(){
        throw new Error("Not implemented");
    }
}
