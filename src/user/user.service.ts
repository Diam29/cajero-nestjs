import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dataUser from '../users/dataUser.json'
import { DepositoDto } from './dto/deposito.dto';
import * as fs from 'fs'
import * as path from 'path';
import { ExtraccionDto } from './dto/extraccion.dto';

@Injectable()
export class UserService {
  private userFilePath = path.resolve(__dirname, '../../src/users/dataUser.json')

  private async readFileAsync(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  // Buscar Usuario por id
  async findUser(id: string) {
    try {
      const data = await this.readFileAsync(this.userFilePath)
      const user = data.find(user => user.id === id)

      if (!user) {
        throw new NotFoundException('Usuario no encontrado')
      }
      console.log('user get id', user)
      return user
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar usuario');
    }
  }


  // Consultar Saldo
  async findBalance(id: string) {
    try {
      const loggerUser = await this.findUser(id);
      if (!loggerUser.saldoTotal || typeof loggerUser.saldoTotal !== 'number') {
        throw new InternalServerErrorException('El saldo no está disponible');
      }

      const saldoFound = dataUser.find(user => user.id === loggerUser.id).saldoTotal

      return `Su saldo es: $${saldoFound}`

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Error al consultar el saldo');
      }
    }
  }



  // Metodo para registrar un deposito
  async addDepositoUser(id: string, newDeposito: DepositoDto) {
    try {
      // Leer el contenido del archivo JSON de forma síncrona
      const dataJson = JSON.parse(fs.readFileSync(this.userFilePath, 'utf-8'));

      // Encontrar el usuario por su ID
      const user = dataJson.find((us) => us.id === id);

      if (user) {
        // Actualizar el depósito y saldo del usuario
        user.deposito = newDeposito.deposito;
        user.saldoTotal += newDeposito.deposito;

        // Escribir el JSON actualizado de forma síncrona
        fs.writeFileSync(this.userFilePath, JSON.stringify(dataJson, null, 2));

        return `Su depósito de monto: $${user.deposito} en la cuenta N° ${user.numCuenta}, fue realizado con éxito!`;
      } else {
        return 'Usuario no encontrado';
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Ocurrió un error al realizar el depósito');
      }
    }
  }


  // Metodo para registrar una extraccion
  async extraccionUser(id: string, newExtraccion: ExtraccionDto) {
    try {
      const dataJson = JSON.parse(fs.readFileSync(this.userFilePath, 'utf-8'));
      const user = dataJson.find((us) => us.id === id);

      if (!user) {
        throw new HttpException('Usuario no encontrado', 404);
      }

      if (newExtraccion.extraccion > user.saldoTotal) {
        throw new HttpException('Su saldo es insuficiente. Puede consultar su saldo, probar con otro monto o cancelar la operación.', 400);
      }

      user.saldoTotal -= newExtraccion.extraccion;
      user.saldoTotal = parseFloat(user.saldoTotal.toFixed(2));

      fs.writeFileSync(this.userFilePath, JSON.stringify(dataJson, null, 2));

      return `Su extracción de monto: $${newExtraccion.extraccion} en la cuenta N° ${user.numCuenta}, fue realizado con éxito!`;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('ERROR_SERVER', 500);
    }
  }


}



