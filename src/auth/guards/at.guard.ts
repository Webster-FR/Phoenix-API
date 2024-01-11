import {CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "../../common/services/jwt.service";
import {AuthController} from "../auth.controller";
import {UsersService} from "../../users/users.service";
import {AtPayloadModel} from "../models/models/at-payload.model";
import {ConfigService} from "@nestjs/config";
import {TokensService} from "../tokens.service";
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
            throw new UnauthorizedException("Invalid or missing access token payload");
        if(payload.type !== TokenType.ACCESS)
            throw new UnauthorizedException("Invalid access type: " + payload.type);
        const dbToken = await this.tokensService.getTokenEntity(token, false, false);
        if(!dbToken)
            throw new UnauthorizedException("Token not found in database");
        if(dbToken.blacklisted)
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
