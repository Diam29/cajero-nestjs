import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./jwt.constants";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        // Genero una calve secreta especifica para c/user
        const userSpecificSecret = `${jwtConstants.secret}-${payload.id}`

        // Utilizacion de la clave secreta dinamica para verificar el token
        const strategyWithOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: userSpecificSecret
        }

        // Verificacion de la clave secreta dinamica
        const strategy = new Strategy(strategyWithOptions, (payload, done) => {
            jwt.verify(payload, userSpecificSecret, (err, decoded) => {
                if (err) {
                    return done(err, false);
                }
                return done(null, decoded);
            });
        })

        return { id: payload.id, name: payload.name };
    }
}


