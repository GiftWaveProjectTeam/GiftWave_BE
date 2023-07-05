import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        private jwtService: JwtService,
    ){}

    // 일반 로그인
    async login(authCredentialDto: AuthCredentialDto): Promise<{accessToken : string}> {
        const { user, password } = authCredentialDto
        const result = await this.userRepository.findOne({ where: {user}})

        if(result && (await bcrypt.compare(password, result.password))) {
            // 유저 토큰 생성
            const payload = { user }
            const accessToken = await this.jwtService.sign(payload)
            return {accessToken}
        } else {
            throw new UnauthorizedException('로그인에 실패하였습니다.')
        }
    }
}
