import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from 'src/entities/Users.entity';

@Controller('register')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 회원가입
  @Post()
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<Users> {
    return this.usersService.createUser(createUserDto);
  }
}
