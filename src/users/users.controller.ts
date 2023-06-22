import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from 'src/entities/Users.entity';

@Controller('resister')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // 회원가입
    @Post()
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
        return this.usersService.createUser(createUserDto)
    }
}
