import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class AtGuard implements CanActivate{

    async canActivate(context: ExecutionContext): Promise<boolean>{
        return !!context;
    }

    // constructor(private jwtService: JwtService, private usersService: UsersService){}
    //
    // async canActivate(context: ExecutionContext): Promise<boolean>{
    //     const request = context.switchToHttp().getRequest();
    //     const token = this.extractTokenFromHeader(request);
    //     if(!token)
    //         throw new UnauthorizedException("Missing bearer token");
    //     let payload: JwtPayloadModel;
    //     try{
    //         payload = <JwtPayloadModel>this.jwtService.verifyJWT(token, process.env.JWT_KEY);
    //     }catch (e){
    //         throw new UnauthorizedException("Invalid bearer token");
    //     }
    //     if(!payload)
    //         throw new UnauthorizedException("Invalid bearer token");
    //     const user = await this.usersService.findOne(payload.id);
    //     if(!user)
    //         throw new NotFoundException("User not found");
    //     delete user.password;
    //     request.user = user;
    //     return true;
    // }
    //
    // private extractTokenFromHeader(request: FastifyRequest): string | undefined{
    //     const [type, token] = request.headers.authorization?.split(" ") ?? [];
    //     return type === "Bearer" ? token : undefined;
    // }
}
