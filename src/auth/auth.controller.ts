import {Body, Controller, HttpStatus, Post, Query, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfirmAccountDto} from "./models/dto/confirm-account.dto";
import {AtRtResponse} from "./models/responses/atrt.response";
import {CtResponse} from "./models/responses/ct.response";
import {AtResponse} from "./models/responses/at.response";
import {KeepParamDto} from "./models/dto/keep-param.dto";
import {RegisterDto} from "./models/dto/register.dto";
import {LoginDto} from "./models/dto/login.dto";
import {AuthService} from "./auth.service";
import {AtGuard} from "./guards/at.guard";
import {RtGuard} from "./guards/rt.guard";
import {CtGuard} from "./guards/ct.guard";
import {RtDto} from "./models/dto/rt.dto";
import {AtDto} from "./models/dto/at.dto";
import {FastifyRequest} from "fastify";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController{
    constructor(private readonly authService: AuthService){}

    static extractTokenFromHeader(request: FastifyRequest): string | undefined{
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }

    @Post("login")
    @ApiResponse({status: HttpStatus.OK, description: "User logged in successfully", type: AtRtResponse})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Missing required fields"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid password"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Email not found"})
    async login(@Query() params: KeepParamDto, @Body() loginDto: LoginDto): Promise<AtRtResponse | CtResponse>{
        console.log(params);
        return await this.authService.loginUser(loginDto.email, loginDto.password, params.keep);
    }

    @Post("logout")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.ACCEPTED, description: "All tokens invalidated"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "AT or RT not found in database"})
    async logout(@Req() req: any, @Body() body: RtDto){
        return await this.authService.logout(req.token.token, body.refresh_token);
    }

    @Post("logout/all")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "All tokens invalidated"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid access token"})
    async logoutAll(@Req() req: any){
        return await this.authService.logoutAll(req.user.id);
    }

    @Post("register")
    @ApiResponse({status: HttpStatus.CREATED, description: "User registered successfully", type: CtResponse})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Missing required fields or password too weak"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Email already exists"})
    async register(@Body() registerDto: RegisterDto): Promise<CtResponse>{
        return await this.authService.registerUser(registerDto.username, registerDto.email, registerDto.password);
    }

    @Post("refresh")
    @UseGuards(RtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Token refreshed successfully", type: AtRtResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid refresh token"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Refresh token already used"})
    async refresh(@Req() req: any, @Body() body: AtDto): Promise<AtRtResponse>{
        const at = body.access_token;
        const rt = req.token.token;
        return this.authService.refresh(at, rt);
    }

    @Post("register/confirm")
    @UseGuards(CtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Account confirmed successfully", type: AtResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid confirmation token"})
    async confirmAccount(@Req() req: any, @Body() body: ConfirmAccountDto): Promise<AtRtResponse | AtResponse>{
        return await this.authService.confirmAccount(req.user.id, body.code, req.token.keep);
    }

    @Post("register/confirm/resend")
    @UseGuards(CtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Confirmation code resent successfully", type: CtResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid confirmation token"})
    async resendConfirmationCode(@Req() req: any): Promise<CtResponse>{
        return await this.authService.resendConfirmationCode(req.user.id);
    }
}
