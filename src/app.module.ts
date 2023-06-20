import { Module } from '@nestjs/common';
import { FundingsModule } from './funding/funding.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from './entities/Funding.entity';
import { Users } from './entities/Users.entity';
import { FundingLike } from './entities/FundingLike.entity';
import { Celebration } from './entities/Celebration.entity';
import { Payment } from './entities/Payment.entity';
import { Recipient } from './entities/Recipient.entity';
import { Address } from './entities/Address.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'black820',
        database: 'giftwave-dev',
        entities: [
          Funding,
          Users,
          FundingLike,
          Celebration,
          Payment,
          Recipient,
          Address,
        ],
        synchronize: true,
      }),
    }),
    FundingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
