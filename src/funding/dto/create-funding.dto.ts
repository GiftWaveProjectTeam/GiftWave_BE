import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFundingDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  option: string;

  @IsNotEmpty()
  price: bigint;

  @IsNotEmpty()
  finishDate: Date;

  @IsNotEmpty()
  receiveName: string;

  @IsOptional()
  receiveAddress: string;

  @IsOptional()
  resceivePhoneNum: string;
}
