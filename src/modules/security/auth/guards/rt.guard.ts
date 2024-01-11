import {CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "../../../../common/services/jwt.service";
import {UsersService} from "../../users/users.service";
import {ConfigService} from "@nestjs/config";
import {TokensService} from "../tokens.service";
import {AuthController} from "../auth.controller";
import {AtPayloadModel} from "../models/models/at-payload.model";
import {TokenType} from "../models/models/token-type";
import {RtPayloadModel} from "../models/models/rt-payload.model";
import {AuthService} from "../auth.service";

@Injectable()
export class RtGuard implements CanActivate{

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly tokensService: TokensService,
        private readonly authService: AuthService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = AuthController.extractTokenFromHeader(request);
        if(!token)
            throw new UnauthorizedException("Missing refresh token");
        let payload: AtPayloadModel;
        try{
            payload = <RtPayloadModel>this.jwtService.verifyJWT(token, this.configService.get("RT_KEY"));
        }catch (e){
            throw new UnauthorizedException("Invalid refresh token");
        }
        if(!payload)
            throw new UnauthorizedException("Invalid or missing refresh token payload");
        if(payload.type !== TokenType.REFRESH)
            throw new UnauthorizedException("Invalid refresh type: " + payload.type);
        const dbToken = await this.tokensService.getTokenEntity(token, true, false);
        if(!dbToken)
            throw new UnauthorizedException("Token not found in database");
        const user = await this.usersService.findById(payload.user_id);
        if(!user)
            throw new NotFoundException("User not found");
        if(dbToken.blacklisted){
            await this.authService.logoutAll(user);
            throw new UnauthorizedException("Blacklisted refresh token, logout user from all devices");
        }
        delete user.password;
        request.user = user;
        request.token = {...payload, token};
        return true;
    }
}
