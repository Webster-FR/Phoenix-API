import {Body, Controller, HttpCode, HttpStatus, NotFoundException, Post, UnauthorizedException} from "@nestjs/common";
import {EncryptionService} from "../services/encryption.service";
import {TokenResponseModel} from "./models/token-response.model";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {UsersService} from "../users/users.service";
import {LoginUserDto} from "./dto/login-user.dto";
import {AuthService} from "./auth.service";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController{
    constructor(
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly authService: AuthService
    ){}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: HttpStatus.OK, type: TokenResponseModel})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid password"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid request body"})
    async login(@Body() loginUserDto: LoginUserDto){
        const user = await this.usersService.getUserByUsername(loginUserDto.username);
        if(!user)
            throw new NotFoundException("User not found");
        if(!await this.encryptionService.comparePassword(user.password, loginUserDto.password))
            throw new UnauthorizedException("Invalid password");
        return new TokenResponseModel(this.authService.getToken(user.id));
    }
}
