import {Injectable} from "@nestjs/common";
import {JwtService} from "../services/jwt.service";

@Injectable()
export class AuthService{
    constructor(private jwtService: JwtService){}

    getToken(userId: number){
        return this.jwtService.generateJWT({id: userId}, process.env.TOKEN_DURATION, process.env.JWT_KEY);
    }
}
