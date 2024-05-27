import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Busqueda de Usuario por Dni y Clave
  @Post('login')
  async loginUser(@Body() userLogin: LoginAuthDto) {
    const response = await this.authService.login(userLogin);
    return response
  }
}
