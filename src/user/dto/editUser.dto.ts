import { IsDateString, IsOptional } from "class-validator"

export class EditUserDto {
    @IsOptional()
    username?: string

    @IsOptional()
    password?: string

    @IsOptional()
    firstname?: string
    @IsOptional()
    lastname?: string

    @IsOptional()
    @IsDateString()
    birthdate?: string | Date
}
