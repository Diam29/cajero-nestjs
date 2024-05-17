import { IsNotEmpty, IsNumber, MaxLength, MinLength } from "class-validator"

export class LoginAuthDto {
    @IsNumber()
    @IsNotEmpty()
    @MaxLength(8)
    @MinLength(7)
    dni: number

    @IsNumber()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(4)
    key: number
}
