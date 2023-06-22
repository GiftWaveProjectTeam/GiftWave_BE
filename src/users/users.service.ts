import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRole, UserStatus, UserType } from "./users.enum";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ){}

    // 회원가입
    async createUser(createUserDto: CreateUserDto): Promise<Users> {
        const { user, password, nickname, phone_number, gender, birthday } = createUserDto

        const userId = await this.userRepository.findOne({ where : {user: user}})
        if(userId) {
            throw new BadRequestException('이미 존재하는 이메일 입니다.')
        }

        const userNickname = await this.userRepository.findOne({ where: {nickname: nickname}})
        if(userNickname) {
            throw new BadRequestException('이미 존재하는 닉네임 입니다.')
        }

        const result = this.userRepository.create({
            user,
            password,
            phone_number,
            nickname,
            gender,
            birthday,
            user_type: UserType.UT01,
            user_status: UserStatus.US01,
            user_role: UserRole.UR01,
        })

        await this.userRepository.save(result)
        return result;
    }
}