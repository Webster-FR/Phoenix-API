import {Injectable} from "@nestjs/common";
import {totp} from "otplib";
import * as qrcode from "qrcode";

@Injectable()
export class TotpService{
    generateTotpQrCode(user: string, issuer: string, secret: string){
        if(!user || !issuer || !secret)
            throw new Error("Invalid parameters");
        const totpUri = totp.keyuri(user, issuer, secret);
        return qrcode.toDataURL(totpUri);
    }

    verifyTOTP(secret: string, token: string){
        if(!secret || !token)
            return false;
        return totp.check(token, secret);
    }
}
