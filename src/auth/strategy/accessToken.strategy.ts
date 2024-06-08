import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { UserInfo } from "../dto/auth.dto";

import { DatabaseService } from "../../database/database.service";
import { Request } from "express";

@Injectable()
export class JwtAccesTokenStrategy extends PassportStrategy(Strategy, "access-token") {
    constructor(configService: ConfigService, private readonly databaseService: DatabaseService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtAccesTokenStrategy.extractJWTFromCookie
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("ACCESS_SECRET")
        })
    }

    private static extractJWTFromCookie(request: Request): string | null {
        if (request.cookies && request.cookies.accessToken) {
            return request.cookies.accessToken;
        }
        return null;
    }

    async validate(payload: UserInfo) {
        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload.id
            }
        })

        return user
    }
}
