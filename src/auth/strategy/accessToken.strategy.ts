import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { UserInfo } from "../dto/auth.dto";

import { DatabaseService } from "../../database/database.service";

@Injectable()
export class JwtAccesTokenStrategy extends PassportStrategy(Strategy, "access-token") {
    constructor(configService: ConfigService, private readonly databaseService: DatabaseService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("ACCESS_SECRET")
        })
    }

    async validate(payload: UserInfo){
        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload.id
            }
        })

        delete user.password
        return user
    }
}
