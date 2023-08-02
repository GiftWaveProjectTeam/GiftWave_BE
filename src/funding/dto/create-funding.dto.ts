import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFundingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  option: string;

  @IsNotEmpty()
  @IsNumber()
  price: bigint;

  @IsOptional()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsDate()
  finishDate: Date;

  @IsNotEmpty()
  @IsString()
  receiveName: string;

  @IsNotEmpty()
  @IsString()
  phoneNum: string;

  @IsOptional()
  @IsString()
  bank: string;

  @IsOptional()
  @IsString()
  accountNum: string;
}
