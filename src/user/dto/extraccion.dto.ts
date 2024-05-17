import { IsNotEmpty, IsNumber } from "class-validator";


export class ExtraccionDto {
    @IsNumber()
    @IsNotEmpty()
    extraccion: number;
}