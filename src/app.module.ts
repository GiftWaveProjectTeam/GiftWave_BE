import { Module } from '@nestjs/common';
import { FundingsModule } from './funding/funding.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    FundingsModule,
  ],
})
export class AppModule {}
