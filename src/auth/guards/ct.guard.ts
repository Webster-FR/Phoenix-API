import {CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "../../services/jwt.service";
import {UsersService} from "../../users/users.service";
import {ConfigService} from "@nestjs/config";
import {AuthController} from "../auth.controller";
import {AtPayloadModel} from "../models/models/at-payload.model";
import {TokenType} from "../models/models/token-type";
import {CtPayloadModel} from "../models/models/ct-payload.model";

@Injectable()
export class CtGuard implements CanActivate{

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = AuthController.extractTokenFromHeader(request);
        if(!token)
            throw new UnauthorizedException("Missing confirm token");
        let payload: AtPayloadModel;
        try{
            payload = <CtPayloadModel>this.jwtService.verifyJWT(token, this.configService.get("CT_KEY"));
        }catch (e){
            throw new UnauthorizedException("Invalid confirm token");
        }
        if(!payload)
            throw new UnauthorizedException("Invalid confirm token");
        if(payload.type !== TokenType.CONFIRMATION)
            throw new UnauthorizedException("Invalid confirm type: " + payload.type);
        const user = await this.usersService.findById(payload.user_id);
        if(!user)
            throw new NotFoundException("User not found");
        delete user.password;
        request.user = user;
        request.token = {...payload, token};
        return true;
    }
}
