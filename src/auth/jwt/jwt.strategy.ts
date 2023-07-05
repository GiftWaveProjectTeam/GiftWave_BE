import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy } from "passport-jwt"
import { Users } from "src/entities/Users.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userRepository: Repository<Users>
    ) {
        super({
            secretOrkey: process.env.SECRET_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { user } = payload;
        const users: Users = await this.userRepository.findOne({ where: {user}})

        if(!users) {
            throw new UnauthorizedException();
        }

        return users;
    }
}