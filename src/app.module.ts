import { Module } from '@nestjs/common';
import { FundingsModule } from './funding/funding.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DetailModule } from './detail/detail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    AuthModule,
    FundingsModule,
    DetailModule,
  ],
})
export class AppModule {}
