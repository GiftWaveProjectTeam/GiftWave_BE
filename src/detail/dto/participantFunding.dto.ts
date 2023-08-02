import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class participantFundingDto {
  @IsNotEmpty()
  @IsNumber()
  payment: bigint;

  @IsOptional()
  @IsString()
  celebration: string;
}
