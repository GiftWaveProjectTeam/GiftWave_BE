import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { DetailService } from './detail.service';
import { Funding } from 'src/entities/Funding.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Funding])],
  controllers: [DetailController],
  providers: [DetailService],
})
export class DetailModule {}
