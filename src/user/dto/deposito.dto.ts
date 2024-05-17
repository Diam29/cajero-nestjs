import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class DepositoDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    @IsNotEmpty()
    deposito: number;
}
