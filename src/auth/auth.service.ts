import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import dataUser from '../users/dataUser.json'
import { JwtService } from '@nestjs/jwt';

@Injectable()

export class AuthService {

  constructor(private jwtService: JwtService) { }

  // Servicio Busqueda de usuario por Dni
  async login(userLogin: LoginAuthDto) {
    const { dni, key } = userLogin;

    const findUser = dataUser.find(user => user.dni === dni)
    if (!findUser) throw new HttpException('Datos incorrectos', 404)

    const findKey = dataUser.find(user => user.key === key)
    if (!findKey) throw new HttpException('Datos incorrectos', 403)

    const payload = { id: findUser.id, name: findUser.name }
    const token = this.jwtService.sign(payload)

    const userData = {
      user: findUser,
      token,
    }

    return userData
  }
}
