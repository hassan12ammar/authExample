import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { DatabaseService } from "../../database/database.service"
import { UserInfoSign } from "../dto/auth.dto"
import { Request } from "express"

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "refresh-token") {
    constructor(configService: ConfigService, private readonly databaseService: DatabaseService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtRefreshTokenStrategy.extractJWTFromCookie
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("REFRESH_SECRET"),
        })
    }

    private static extractJWTFromCookie(request: Request): string | null {
        if (request.cookies && request.cookies.refreshToken) {
            return request.cookies.refreshToken;
        }
        return null;
    }

    async validate(payload: UserInfoSign) {
        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload.id
            }
        })

        return user
    }
}
