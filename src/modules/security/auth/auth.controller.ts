import {Body, Controller, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfirmAccountDto} from "./models/dto/confirm-account.dto";
import {AtRtResponse} from "./models/responses/atrt.response";
import {AtResponse} from "./models/responses/at.response";
import {KeepParamDto} from "./models/dto/keep-param.dto";
import {RegisterDto} from "./models/dto/register.dto";
import {FastifyReply, FastifyRequest} from "fastify";
import {LoginDto} from "./models/dto/login.dto";
import {AuthService} from "./auth.service";
import {RtGuard} from "./guards/rt.guard";
import {UseAT} from "./decorators/public.decorator";

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
    @ApiResponse({status: HttpStatus.ACCEPTED, description: "Confirmation code re-sent"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Missing required fields"})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: "Invalid password"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Email not found"})
    @ApiResponse({status: HttpStatus.PRECONDITION_FAILED, description: "Email not confirmed"})
    async login(@Res() res: FastifyReply, @Query() params: KeepParamDto, @Body() loginDto: LoginDto): Promise<AtRtResponse | AtResponse>{
        const response =  await this.authService.loginUser(loginDto.email, loginDto.password, params.keep);
        if(!response)
            return res.code(HttpStatus.ACCEPTED).send();
        return res.code(HttpStatus.OK).send(response);
    }

    @Post("register")
    @ApiResponse({status: HttpStatus.CREATED, description: "User registered successfully"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Missing required fields or password too weak"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Email already exists"})
    async register(@Body() registerDto: RegisterDto): Promise<void>{
        await this.authService.registerUser(registerDto.username, registerDto.email, registerDto.password);
    }

    @Post("register/confirm")
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({status: HttpStatus.NO_CONTENT, description: "Account confirmed successfully"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid code"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "No user found for this code"})
    async confirmAccount(@Body() body: ConfirmAccountDto): Promise<void>{
        await this.authService.confirmAccount(body.code);
    }

    @Post("logout")
    @UseAT()
    @ApiBearerAuth()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiResponse({status: HttpStatus.ACCEPTED, description: "All tokens invalidated"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Access or refresh token not found in database"})
    async logout(@Req() req: any){
        return await this.authService.logout(req.token.token);
    }

    @Post("logout/all")
    @UseAT()
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, description: "All tokens invalidated"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid access token"})
    async logoutAll(@Req() req: any){
        return await this.authService.logoutAll(req.user);
    }

    @Post("refresh")
    @UseGuards(RtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, description: "Token refreshed successfully", type: AtRtResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid refresh token"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Refresh token already used"})
    async refresh(@Req() req: any): Promise<AtRtResponse>{
        const rt = req.token.token;
        return this.authService.refresh(req.user, rt);
    }
}
