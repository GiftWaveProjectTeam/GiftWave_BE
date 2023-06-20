import { Injectable } from '@nestjs/common';
import { CreateFundingDto } from './dto/create-funding.dto';
import { Funding } from 'src/entities/Funding.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,
  ) {}
  async createFunding(createfunding: CreateFundingDto): Promise<any> {
    const {
      title,
      content,
      option,
      price,
      finishDate,
      receiveName,
      receiveAddress,
      resceivePhoneNum,
    } = createfunding;

    const funding = this.fundingRepository.create({
      title,
      option,
      price,
    });
    console.log(funding);
  }
}
