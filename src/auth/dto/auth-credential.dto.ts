import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class AuthCredentialDto extends CreateUserDto {
  user: string;
  password: string;
}
