import { Module } from '@nestjs/common';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from 'src/entities/Funding.entity';
import { Recipient } from 'src/entities/Recipient.entity';
import { Account } from 'src/entities/Account.entity';
import { JwtStrategy } from './../auth/jwt/jwt.strategy';
import { Users } from 'src/entities/Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funding, Recipient, Account, Users])],
  controllers: [FundingController],
  providers: [FundingService, JwtStrategy],
})
export class FundingsModule {}
