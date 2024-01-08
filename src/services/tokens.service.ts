import {Injectable, NotFoundException} from "@nestjs/common";
import {JwtService} from "./jwt.service";
import {PrismaService} from "./prisma.service";
import {ConfigService} from "@nestjs/config";
import {EncryptionService} from "./encryption.service";
import {AtPayloadModel} from "../auth/models/models/at-payload.model";
import {RtPayloadModel} from "../auth/models/models/rt-payload.model";
import {TokenEntity} from "../auth/models/entities/token.entity";

@Injectable()
export class TokensService{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService
    ){}

    async generateAccessToken(userId: number): Promise<string>{
        const payload = new AtPayloadModel(userId, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("AT_DURATION"), this.configService.get("AT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        await this.prismaService.tokens.create({
            data: {
                user_id: userId,
                sum: sum,
                token: await this.encryptionService.hash(token, 6),
                is_refresh: false,
                expires: new Date(expires * 1000)
            }
        });
        return token;
    }

    async generateRefreshToken(userId: number): Promise<string>{
        const payload = new RtPayloadModel(userId, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("RT_DURATION"), this.configService.get("RT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        await this.prismaService.tokens.create({
            data: {
                user_id: userId,
                sum,
                token: await this.encryptionService.hash(token, 6),
                is_refresh: true,
                expires: new Date(expires * 1000)
            }
        });
        return token;
    }

    async getTokenEntity(token: string, isRefresh: boolean, exception: boolean = true): Promise<TokenEntity>{
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const tokens = await this.prismaService.tokens.findMany({
            where: {
                sum: sum,
                is_refresh: isRefresh,
            },
        });
        if(!tokens && exception)
            throw new NotFoundException("Token not found");
        for(const dbToken of tokens)
            if(await this.encryptionService.compareHash(dbToken.token, token))
                return dbToken;
        if(exception)
            throw new NotFoundException("Token not found");
        else
            return null;
    }

    async blacklistToken(token: string, isRefresh: boolean, exception: boolean = true){
        const dbToken = await this.getTokenEntity(token, isRefresh, exception);
        if(!exception && !dbToken)
            return false;
        await this.prismaService.tokens.update({
            where: {
                id: dbToken.id,
            },
            data: {
                blacklisted: true,
            },
        });
        return true;
    }

    async blacklistUserTokens(userId: number){
        await this.prismaService.tokens.updateMany({
            where: {
                user_id: userId,
            },
            data: {
                blacklisted: true,
            },
        });
    }

    async deleteExpiredTokens(){
        const {count} = await this.prismaService.tokens.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });
        return count;
    }
}
