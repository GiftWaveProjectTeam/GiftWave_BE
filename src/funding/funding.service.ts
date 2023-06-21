import { Injectable } from '@nestjs/common';
import { CreateFundingDto } from './dto/create-funding.dto';
import { Funding } from 'src/entities/Funding.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipient } from 'src/entities/Recipient.entity';
import { Account } from 'src/entities/Account.entity';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(Recipient)
    private recipientRepository: Repository<Recipient>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}
  async createFunding(createfunding: CreateFundingDto): Promise<object> {
    const {
      title,
      content,
      option,
      price,
      url,
      finishDate,
      receiveName,
      phoneNum,
      bank,
      accountNum,
    } = createfunding;
    //트랜젝션걸어야할듯
    const funding = await this.fundingRepository.save({
      title,
      content,
      page_url: url,
      perchase: false,
      option,
      price,
      finish_date: finishDate,
    });

    const recipient = await this.recipientRepository.save({
      name: receiveName,
      phone_number: phoneNum,
      Funding: funding,
    });
    await this.accountRepository.save({
      bank,
      account: accountNum,
      Recipient: recipient,
    });

    return Promise.resolve({ message: '펀딩 등록이 완료되었습니다.' });
  }
}
