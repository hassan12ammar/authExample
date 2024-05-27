import { Injectable, NotFoundException } from "@nestjs/common"
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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("REFRESH_SECRET"),
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: UserInfoSign) {
        const refreshToken = req
            ?.get('authorization')
            ?.replace('Bearer', '')
            .trim();

        if (!refreshToken) {
            throw new NotFoundException('Refresh token malformed');
        }

        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload.id
            }
        })

        delete user.password
        return user
    }
}
