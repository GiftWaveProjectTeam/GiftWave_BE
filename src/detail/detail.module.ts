import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { DetailService } from './detail.service';
import { Funding } from 'src/entities/Funding.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { Payment } from 'src/entities/Payment.entity';
import { Users } from 'src/entities/Users.entity';
import { Celebration } from 'src/entities/Celebration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funding, Payment, Users, Celebration])],
  controllers: [DetailController],
  providers: [DetailService, JwtStrategy],
})
export class DetailModule {}
