import { IsDate, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: '아이디는 영문 대소문자, 숫자로 이루어져야합니다.'
    })
    user: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/^[a-zA-Z0-9!@#$%&]*$/, {
        message: '비밀번호는 영문 대소문자, 특수기호, 숫자로 이루어져야합니다.'
    })
    password: string

    @IsNotEmpty()
    @IsString()
    phone_number: string

    @IsNotEmpty()
    @IsString()
    nickname: string

    @IsNotEmpty()
    @IsString()
    gender: string

    @IsNotEmpty()
    birthday: Date
}