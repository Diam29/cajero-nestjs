import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepositoDto } from './dto/deposito.dto'
import { ExtraccionDto } from './dto/extraccion.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  // Buscar usuario por Id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  // Consultar saldo
  @Get('saldo/:id')
  findSaldo(@Param('id') id: string) {
    return this.userService.findBalance(id)
  }


  // Cargar un Deposito
  @Patch('deposito/:id')
  realizarDeposito(@Param('id') id: string, @Body() newDeposito: DepositoDto) {
    return this.userService.addDepositoUser(id, newDeposito);
  }

  // Realizar una Extracción
  @Patch('extraccion/:id')
  realizarExtraccion(@Param('id') id: string, @Body() newExtraccion: ExtraccionDto) {
    return this.userService.extraccionUser(id, newExtraccion)
  }

}
