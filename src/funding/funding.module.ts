import { Module } from '@nestjs/common';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from 'src/entities/Funding.entity';
import { Recipient } from 'src/entities/Recipient.entity';
import { Account } from 'src/entities/Account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funding, Recipient, Account])],
  controllers: [FundingController],
  providers: [FundingService],
})
export class FundingsModule {}
