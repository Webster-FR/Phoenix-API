import {Injectable} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtService{
    generateJWT(content: any, expiresIn: string, jwtKey: string | Buffer, symmetric = true, privateEncryptionKey = undefined){
        const algorithm = symmetric ? "HS512" : "RS512";
        if(symmetric)
            return jwt.sign(content, jwtKey, {expiresIn, algorithm});
        else
            return jwt.sign(content, {key: jwtKey, passphrase: privateEncryptionKey}, {expiresIn, algorithm});
    }

    verifyJWT(token: string, jwtKey: string | Buffer){
        return jwt.verify(token, jwtKey);
    }
}
