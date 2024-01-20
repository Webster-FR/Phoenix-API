import {RefreshTokenEntity} from "./refresh-token.entity";
import {AccessTokenEntity} from "./access-token.entity";

export type TokenEntity = AccessTokenEntity | RefreshTokenEntity;
