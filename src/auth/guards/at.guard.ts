import {CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "../../services/jwt.service";
import {AuthController} from "../auth.controller";
import {UsersService} from "../../users/users.service";
import {AtPayloadModel} from "../models/models/at-payload.model";
import {ConfigService} from "@nestjs/config";
import {TokensService} from "../../services/tokens.service";
import {TokenType} from "../models/models/token-type";

@Injectable()
export class AtGuard implements CanActivate{

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly tokensService: TokensService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = AuthController.extractTokenFromHeader(request);
        if(!token)
            throw new UnauthorizedException("Missing access token");
        let payload: AtPayloadModel;
        try{
            payload = <AtPayloadModel>this.jwtService.verifyJWT(token, this.configService.get("AT_KEY"));
        }catch (e){
            throw new UnauthorizedException("Invalid access token");
        }
        if(!payload)
            throw new UnauthorizedException("Invalid access token");
        if(payload.type !== TokenType.ACCESS)
            throw new UnauthorizedException("Invalid access type");
        if(await this.tokensService.isTokenBlacklisted(token, false))
            throw new UnauthorizedException("Blacklisted access token");
        const user = await this.usersService.findById(payload.user_id);
        if(!user)
            throw new NotFoundException("User not found");
        delete user.password;
        request.user = user;
        request.token = {...payload, token};
        return true;
    }
}