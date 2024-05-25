import { AuthGuard } from "@nestjs/passport";

export class JwtAccesGuard extends AuthGuard("access-token"){
    constructor(){
        super()
    }
}

export class JwtRefreshTokenGuard extends AuthGuard("refresh-token"){
    constructor(){
        super()
    }
}
