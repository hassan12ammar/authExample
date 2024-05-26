import { IsDateString, IsNotEmpty, IsOptional } from "class-validator"

export class SignUpDto{
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    firstname: string
    @IsNotEmpty()
    lastname: string

    @IsOptional()
    @IsDateString()
    birthdate?: string | Date
}

export class SignInDto{
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}

export class UserInfoSign{
    id: number
    username: string
}

export class UserInfo{
    id: number
    username: string
    firstname: string
    lastname: string
    birthdate: Date
}

export interface UserOutDto{
    userInfo: UserInfo
    accessToken: string
    refreshToken: string
}
