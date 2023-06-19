import { Module } from '@nestjs/common';
import { FundingsModule } from './funding/funding.module';

@Module({
  imports: [FundingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
