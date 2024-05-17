import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Busqueda de Usuario por Dni y Clave
  @Get('login')
  loginUser(@Body() userLogin: LoginAuthDto) {
    console.log('soy el user login', { body: userLogin }) // Ver en consola
    return this.authService.login(userLogin)
  }
}
