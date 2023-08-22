import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFundingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  option?: string;

  @IsOptional()
  @IsNumber()
  price?: bigint;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsDate()
  finishDate?: Date;

  @IsOptional()
  @IsString()
  receiveName?: string;

  @IsOptional()
  @IsString()
  phoneNum?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  accountNum?: string;

  @IsOptional()
  @IsString()
  accountHolder?: string;
}
