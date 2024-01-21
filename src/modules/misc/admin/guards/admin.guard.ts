import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {AuthController} from "../../../security/auth/auth.controller";

@Injectable()
export class AdminGuard implements CanActivate{

    constructor(
        private readonly configService: ConfigService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const adminSecret = AuthController.extractTokenFromHeader(request);
        if(adminSecret !== this.configService.get("ADMIN_SECRET"))
            throw new UnauthorizedException("Invalid admin secret");
        return true;
    }
}
