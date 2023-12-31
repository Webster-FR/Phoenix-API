import {CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {JwtPayloadModel} from "../models/jwt-payload.model";
import {UsersService} from "../../users/users.service";
import {FastifyRequest} from "fastify";
import {JwtService} from "../../services/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private jwtService: JwtService, private usersService: UsersService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token)
            throw new UnauthorizedException("Missing bearer token");
        let payload: JwtPayloadModel;
        try{
            payload = <JwtPayloadModel>this.jwtService.verifyJWT(token, process.env.JWT_KEY);
        }catch (e){
            throw new UnauthorizedException("Invalid bearer token");
        }
        if(!payload)
            throw new UnauthorizedException("Invalid bearer token");
        const user = await this.usersService.findOne(payload.id);
        if(!user)
            throw new NotFoundException("User not found");
        delete user.password;
        request.user = user;
        return true;
    }

    private extractTokenFromHeader(request: FastifyRequest): string | undefined{
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
