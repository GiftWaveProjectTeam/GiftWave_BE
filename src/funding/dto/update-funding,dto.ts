import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFundingDto {
  @IsNotEmpty()
  @IsString()
  receiveAddress: string;

  @IsNotEmpty()
  @IsString()
  receivePhoneNum: string;
}
