import {AccessTokenEntity} from "../entities/access-token.entity";
import {RefreshTokenEntity} from "../entities/refresh-token.entity";

export class TokenPairModel{
    accessToken: AccessTokenEntity;
    refreshToken: RefreshTokenEntity;
}
