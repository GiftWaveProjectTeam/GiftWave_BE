import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    user: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    phone_number: string

    @IsNotEmpty()
    nickname: string

    @IsNotEmpty()
    gender: string

    @IsNotEmpty()
    birthday: Date
}