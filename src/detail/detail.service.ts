import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/Funding.entity';
import { Resource } from 'src/entities/Resource.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,
  ) {}

  /**
 * {
id : Number
title : String
content : String
imageUrl : String
option : String    //요청사항
price : Number    //목표금액
percent : Number
finishDate : Date
productName : String
receiveName : String
celebrateMsg : [   → 정렬 방식 정해야함
{
nickName : String
celebration : String
}, …
]
}
 */
  async getDetailById(funding_id: string) {
    const funding = await this.fundingRepository
      .createQueryBuilder('Funding')
      .select([
        'Funding.funding_id',
        'Funding.title',
        'Funding.content',
        'Funding.option',
        'Funding.price',
        'Funding.finish_date',
        'Funding.product_name',
        'Resource.file_location',
      ])
      .leftJoin('Funding.Resource', 'Resource')
      .where('Funding.funding_id = :funding_id', { funding_id: funding_id })
      .getOne();


    console.log(funding.Resource.file_location);
  }
}
