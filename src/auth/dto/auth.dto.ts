import { Exclude } from "class-transformer"
import { IsDateString, IsNotEmpty, IsOptional } from "class-validator"

export class SignUpDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @Exclude({ toPlainOnly: true })
    password: string

    @IsNotEmpty()
    firstname: string
    @IsNotEmpty()
    lastname: string

    @IsOptional()
    @IsDateString()
    birthdate?: string | Date

    constructor(partial: Partial<SignUpDto>) {
        Object.assign(this, partial);
    }
}

export class SignInDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    constructor(partial: Partial<SignInDto>) {
        Object.assign(this, partial);
    }
}

export class UserInfoSign {
    id: number
    username: string

    constructor(partial: Partial<UserInfoSign>) {
        Object.assign(this, partial);
    }
}

export class UserInfo extends SignUpDto {
    id: number
    @Exclude({ toPlainOnly: true })
    refreshToken?: string

    constructor(partial: Partial<SignUpDto>) {
        super(partial)
        Object.assign(this, partial);
    }
}

export class UserOut {
    id: number
    username: string
    firstname: string
    lastname: string
    birthdate: Date
    @Exclude({ toPlainOnly: true })
    refreshToken?: string

    constructor(partial: Partial<UserOut>) {
        Object.assign(this, partial);
    }
}


export class UserOutDto {
    userInfo: UserInfo
    @Exclude({ toPlainOnly: true })
    accessToken: string
    @Exclude({ toPlainOnly: true })
    refreshToken: string

    constructor(partial: Partial<UserOutDto>) {
        Object.assign(this, partial);
    }
}
