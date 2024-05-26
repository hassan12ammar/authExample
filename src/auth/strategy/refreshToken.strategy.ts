import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { DatabaseService } from "../../database/database.service"

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "refresh-token") {
    constructor(configService: ConfigService, private readonly databaseService: DatabaseService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("REFRESH_SECRET")
        })
    }

    async validate(payload: any){
        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload.id
            }
        })

        delete user.password
        return user
    }
}
